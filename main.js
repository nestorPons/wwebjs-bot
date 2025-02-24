import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import rules from './src/helpers/rules.js';
import assistant from './src/assistant/assistant.js';
import Message from './src/models/Message.js';
import User from './src/models/User.js';

const {Client, LocalAuth} = pkg;

const whatsapp = new Client({authStrategy: new LocalAuth()});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

whatsapp.on('message_create', async wwebjsMessage => {
    const message = new Message(wwebjsMessage);
    //TODO solo para pruebas
    const user = new User(message.from, message.notifyName);
    await user.init();
    console.log('User: ', user.id, message.from);
    message.text = message.body.slice(1)
    if (!rules(user, message)) return 
    if(!user){
        console.log('No User')
        return false
    } 
    
    const chat = await message.getChat();
    if(!chat){
        console.log('No chat')
        return
    }
    
    console.log("Message: ", message.body);
    chat.sendStateTyping();
    
    if (user.threadId === null) {
        const newThread = await assistant.thread.create(user);
        console.log("New thread created for user:", user.id);
    }
    const respond = await assistant.message(user, message.text, message.timestamp);
    console.log("Respond: ", respond)
    return whatsapp.sendMessage(user.id, respond);
});

whatsapp.initialize();

