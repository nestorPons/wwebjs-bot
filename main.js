import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import rules from './src/rules.js';
import assistant from './src/assistant/assistant.js';
import getUserOrCreate from './src/database/getUser.js';
import setThreadId from './src/database/setThreadId.js';

const {Client, LocalAuth} = pkg;

const whatsapp = new Client({authStrategy: new LocalAuth()});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

whatsapp.on('message_create', async message => {
    console.log(message.from)
    const user = await getUserOrCreate(message.from, message.notifyName);
    if(!user){
        console.log('No User')
        return false
    } 
    
    if (rules(user, message)) return 
    
    const chat = await message.getChat();
    if(!chat){
        console.log('No chat')
        return
    }

    chat.sendStateTyping();
    
    const textMessage = message.body.slice(1);
    const userName = message.notifyName || "Anónimo";

    if (user.threadId === null) {
        console.log('No thread id. Creating....')
        const newThread = await assistant.thread.create();
        await setThreadId(user.id, newThread.id);
        user.threadId = newThread.id;
        console.log("New thread created for user:", user.id);
    }
    const respond = await assistant.message(user, textMessage);
    return whatsapp.sendMessage(message.from, respond);
    
});

whatsapp.initialize();

