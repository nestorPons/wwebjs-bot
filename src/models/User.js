import openDatabase from '../database/open.js';

class User{
    constructor(db, id, name=null) {
        this.db = db;
        this.id = id;
        this.name = name;
        this.threadId = null;
        this.useIA = false;
    }
    
    static async create(id, name=null) {
        const db = await openDatabase();
        const instance = new User(db, id, name);
        await instance.getUserOrCreate();
        return instance;
    }
    
    async getUserOrCreate () {
        const row = await this.db.get(`SELECT * FROM users WHERE id = ?`, this.id);
        if (row) {
            this.threadId = row.thread_id ? row.thread_id : null;
            this.useIA = row.use_ia == 1;
            this.name = row.name;
        } else {
            await this.db.run(`INSERT INTO users (id, name) VALUES (?, ?)`, this.id, this.name);
        }
        return this;
    }
    
    async setUseAI(state = false)
    {
        const stateInt = state ? 1 : 0;
        this.useIA =  state;
        await this.db.get(`UPDATE users SET use_ia = ? WHERE id = ?;`, stateInt, this.id);
        console.log(`El usuario ${this.id} ha cambiado su configuración de IA a ${state ? 'activada' : 'desactivada'}.`);
        return this.useIA;
    }

    async createThreadId  (threadId) {
        await this.db.run(`INSERT INTO users (id, thread_id) VALUES (?, ?)
                     ON CONFLICT(id) DO UPDATE SET thread_id = excluded.thread_id;`,
                     this.id, threadId);
        this.threadId = threadId;
        console.log(`Registro actualizado ID del hilo: ${threadId}`);
        return threadId;
    }

    async deleteThreadId() {
        const result = await this.db.run(`UPDATE users SET thread_id = NULL WHERE id = ?`, this.id);
        this.threadId = null;
        console.log(`Hilo eliminado para el usuario: ${this.id}`);
        return result;
    }
}

export default User;