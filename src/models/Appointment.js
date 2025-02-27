import openDatabase from '../database/open.js';

class Appointment {
    constructor(db, userId, timestamp = null) {
        this.db = db;
        this.table = 'appointments';
        this.userId = userId;
        this.timestamp = timestamp;
    }
    static async init(userId){
        const db = await openDatabase();
        const instance = new Appointment(db, userId);
        return instance;
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
            `INSERT INTO ${this.table} (user_id, timestamp) VALUES (?, ?)`,
            this.userId,
            this.timestamp
        );

        if (!row) return false;
        return true;
    }

    async getAll() {
        const rows = await this.db.all(
            `SELECT * FROM ${this.table} WHERE user_id = ?`,
            this.userId
        );
        if (!rows) return false;
        return rows;
    }
}


export default Appointment;