import openDatabase from './open.js'

const appointment = {
    create : async (userId, timestamp) => {
        const db = await openDatabase();
        await db.run(`INSERT INTO appointment (user_id, timestamp) VALUES (?, ?)`,userId, timestamp);
        console.log(`Creada cita ${userId} para el ${timestamp}`);
    }

}


export default appointment;
