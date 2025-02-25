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
    const user = await User.create(message.from, message.notifyName);
    console.log('User: ', user.id, message.from);
    // TODO - QUITAR ESTO DE AQUI
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
        const newThreadId = await assistant.thread.create();
        await user.createThreadId(newThreadId);
        console.log("Se ha creado un nuevo hilo: ", newThreadId);
    }
    
    const respond = await assistant.message(user, message.text, message.timestamp);
    console.log("Respond: ", respond)
    return whatsapp.sendMessage(user.id, respond);
});

whatsapp.initialize();

