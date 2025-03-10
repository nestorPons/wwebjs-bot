import conn from '../database/conn.js'; 
import User from './User.js';
import Appointment from './Appointment.js';

(async () => {
    try {
        // Verifica la conexión
        await conn.authenticate();
        console.log('Connection has been established successfully.');

        User.hasMany(Appointment, { foreignKey: 'userId' });
        Appointment.belongsTo(User, { foreignKey: 'userId' });

        // Sincroniza todos los modelos
        await conn.sync({force: false});        
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
