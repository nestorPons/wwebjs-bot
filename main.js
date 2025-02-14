import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import rules from './src/rules.js';
import openaiHandler from './src/openaiHandler.js';

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
    const userName = message.notifyName || "Anónimo";
    const  userId = message.from;
    const assistant = await openaiHandler.getAssistant(userName, userId);
    
    const mns = await openaiHandler.sendMessage(assistant, textMessage);
    client.sendMessage(message.from, mns);

});

client.initialize();

