import openDatabase from '../database/open.js';

class User{
    constructor(id, name=null) {
        this.id = id;
        this.name = name;
        this.threadId = null;
        this.useIA = true;
    }
    
    async init() {
        this.db = await openDatabase();
        await this.getUserOrCreate();
    }
    
    async getUserOrCreate () {
        const row = await this.db.get(`SELECT * FROM users WHERE id = ?`, this.id);
        if (row) {
            this.threadId = row.thread_id ? row.thread_id.toString() : null;
            this.useIA = row.use_ia === 1;
            this.name = row.name;
        } else {
            await this.db.run(`INSERT INTO users (id, name) VALUES (?, ?)`, this.id, this.name);
        }
    }
    
    async setUseAI(state = fasle)
    {
        stateInt = state ? 1 : 0;
        const row = await this.db.get(`UPDATE users SET use_ia = ? WHERE id = ?;`, stateInt, userId);
        this.useIA =  row ? row.thread_id.toString() : null;
    }

    async createThreadId  (threadId) {
        await this.db.run(`INSERT INTO users (id, thread_id) VALUES (?, ?)
                     ON CONFLICT(id) DO UPDATE SET thread_id = excluded.thread_id;`,
                     this.id, threadId);
        this.threadId = threadId;
        console.log(`Registro actualizado ID del hilo: ${threadId}`);
    }

    async deleteThreadId() {
        await this.db.run(`UPDATE users SET thread_id = NULL WHERE id = ?`, this.id);
        this.threadId = null;
        console.log(`Hilo eliminado para el usuario: ${this.id}`);
    }
}

export default User;