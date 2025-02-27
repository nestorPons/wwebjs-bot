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
    console.log(wwebjsMessage);
    const message = new Message(wwebjsMessage);
    const user = await User.create(message.from, message.notifyName);
    // TODO - DESARROLLO
    if(message.from == "34660291797@c.us") {
        if(!message.body.startsWith('.')) return false;
        message.text = message.body.slice(1)
    }
    // ------------------------------------------
    switch (message.text) {
        case "Activar bot":
            await user.setUseAI(true);
            return whatsapp.sendMessage(user.id, "Bot activado");
        case "Desactivar bot":
            await user.setUseAI(false);
            return whatsapp.sendMessage(user.id, "Bot desactivado");
    }
    
    const permission = rules(user, message)     
    if (!permission) return 

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

