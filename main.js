import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import rules from './src/rules.js';
import assistant from './src/assistant/assistant.js';
import getUserOrCreate from './src/database/getUser.js';
import setThreadId from './src/database/setThreadId.js';

const {Client, LocalAuth} = pkg;

const client = new Client({authStrategy: new LocalAuth()});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', async message => {
    if (rules(message)) return; 
    const textMessage = message.body.slice(1);
    console.log(textMessage);
    const userName = message.notifyName || "Anónimo";
    const user = await getUserOrCreate(message.from);
    if (user.threadId === null) {
        const newThread = await assistant.thread.create();
        await setThreadId(user.id, newThread.id);
        user.threadId = newThread.id;
        console.log("New thread created for user:", user.id);
    }
    console.log("Thread ID for user", user.id, ":", user.threadId);
    console.log("Message:", textMessage);
    return await assistant.sendMessage(user.threadId, textMessage);

});

client.initialize();

