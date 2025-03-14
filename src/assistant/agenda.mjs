import { whatsapp } from '#main'; 
import Agenda from 'agenda';
import User from '#models/User.js';
import Appointment from '#models/Appointment.js';
import config from '#config/loadConfig.mjs';

// Conexión a MongoDB para la persistencia de Agenda.js
const mongoConnectionString = 'mongodb://localhost:27017/agenda-jobs';
const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } });

// Definir la tarea de envío de recordatorios
agenda.define('send_remember', async () => {
    console.log('Send reminders...');
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime(); // 00:00:00 en milisegundos
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime(); // 23:59:59 en milisegundos
        
        const appointments = await Appointment.query()
            .whereBetween('timestamp', [startOfDay, endOfDay]);

        console.log(`📅 Encontrados ${appointments.length} citas para hoy`);
        
        for (const appointment of appointments) {
            const user = await User.query().findById(appointment.user_id);

            if (!user) {
                console.log(`⚠️ Usuario con ID ${appointment.user_id} no encontrado`);
                continue;
            }

            console.log(`📢 Enviando recordatorio a ${user.name}`);

            const name = user.name;
            const date = new Date(appointment.timestamp).toLocaleString();

            const messageText = config.appointments.reminder.menssage
                .replace('{name}', name)
                .replace('{date}', date);
          
            // Enviar mensaje de WhatsApp
            await whatsapp.sendMessage(`${user.id}`, messageText);
            console.log(`✅ Mensaje enviado a ${user.id}`);
        }
    } catch (error) {
        console.error('❌ Error al obtener las citas:', error);
    }
});

// Iniciar Agenda
await agenda.start();

(async () => {
    const sendReminder = config.appointments.reminder.active || false
    if (sendReminder) {
        console.log('✅ Cron activado');
        const timer = config.appointments.reminder.time.cron
        await agenda.every(timer, 'send_remember');
    }
})(); 

export default agenda;
