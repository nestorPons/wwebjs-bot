import openDatabase from '../database/open.js';

class Appointment {
    constructor(db, userId, timestamp) {
        this.db = db;
        this.userId = userId;
        this.timestamp = timestamp;
    }

    static async create(userId, timestamp) {
        const now = Date.now();
        if(timestamp < now) {
            console.log(timestamp, now)
            console.log('La fecha y hora de la cita deben ser posteriores a la fecha y hora actual.');
            return false;
        }
        const db = await openDatabase(); 
        const instance = new Appointment(db, userId, timestamp);
        await instance.save(); 
        return instance;
    }

    async save() {
        const row = await this.db.run(
            `INSERT INTO appointment (user_id, timestamp) VALUES (?, ?)`,
            this.userId,
            this.timestamp
        );

        if (!row) return false;
        console.log(`Creada cita ${this.userId} para el ${this.timestamp}`);
    }
}


export default Appointment;