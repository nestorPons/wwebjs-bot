process.env.TZ = 'Europe/Madrid'; // Configura la zona horaria a Madrid (España)

import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

import rules from "#helpers/rules.js";
import assistant from "#assistant/assistant.js";
import Message from "#models/Message.js";
import User from "#models/User.js";
import "#assistant/agenda.mjs";
import commands from "#commands/commands.mjs";

const {Client, LocalAuth} = pkg;

const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

const messageQueue = {}; // Almacena los mensajes pendientes por usuario y sus temporizadores

whatsapp.on('message_create', async wwebjsMessage => {
    const message = await Message.construct(wwebjsMessage);
    const user = await User.findOrCreate(message.from, message.fromName);
    const chat = await message.getChat();
    if (!chat) {
        console.log('No chat');
        return;
    }

    if(commands.isCommand(message.text)) {
        const respond = await commands.process(user, message.text);
        return await whatsapp.sendMessage(message.from, respond)
    }

    const permission = await rules(user, message, assistant.canal);
    if (!permission) {
        console.log('No permission');
        return;
    }

    console.log(message.from, message.text, user.use_ia);
   
    // Crear cola de mensajes si no existe para este usuario
    if (!messageQueue[message.from]) {
        messageQueue[message.from] = { messages: [], timer: null };
    }

    // Agregar mensaje a la cola
    messageQueue[message.from].messages.push(message.text);

    // Si hay un temporizador activo, cancelarlo y reiniciar
    if (messageQueue[message.from].timer) {
        clearTimeout(messageQueue[message.from].timer);
    }

    // Iniciar un nuevo temporizador de 2 segundos
    messageQueue[message.from].timer = setTimeout(async () => {
        chat.sendStateTyping();

        if (user.thread_id === null) {
            const newThreadId = await assistant.thread.create();
            await user.updateThreadId(newThreadId);
            console.log("Se ha creado un nuevo hilo: ", newThreadId);
        }

        // Unir los mensajes en un solo string
        const combinedMessage = messageQueue[message.from].messages.join(' ')
        // Generar la respuesta con la IA
        const respond = await assistant.message(user, combinedMessage, message.timestamp);

        // Enviar el mensaje final después de la espera
        const result = await whatsapp.sendMessage(message.from, respond);

        // Limpiar la cola después de enviar
        delete messageQueue[message.from];

        return result;
    }, 2000); // Espera 2 segundos antes de enviar
});




whatsapp.initialize();

export {
    whatsapp
};
