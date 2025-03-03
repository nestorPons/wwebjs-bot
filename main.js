import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import rules from './src/helpers/rules.js';
import assistant from './src/assistant/assistant.js';
import Message from './src/models/Message.js';
import User from './src/models/User.js';

const {Client, LocalAuth} = pkg;

const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

whatsapp.on('message_create', async wwebjsMessage => {
    const message = new Message(wwebjsMessage);
    console.log(message.to);
    const user = await User.create(message.from, message.notifyName);
    const chat = await message.getChat();
    // TODO - DESARROLLO
    console.log(message.from, message.text, user.useIA)
    if(message.from == "34660291797@c.us") {
        if(!message.body.startsWith('.')) return false;
        message.text = message.body.slice(1)
    }
    const permission = await rules(user, message, assistant.canal)     
    if (!permission) return
      
    if(!chat){
        console.log('No chat')
        return
    }
    
    chat.sendStateTyping();
    if (user.threadId === null) {
        const newThreadId = await assistant.thread.create();
        await user.createThreadId(newThreadId);
        console.log("Se ha creado un nuevo hilo: ", newThreadId);
    }
    const respond = (!permission === 'string')?
        permission: 
        await assistant.message(user, message.text, message.timestamp);
    
    console.log("Respond: ", respond)
    return whatsapp.sendMessage(message.to, respond);
});

whatsapp.initialize();

