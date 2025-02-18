import openDatabase from './open.js';
import User from './models/User.js'
import { Models } from 'openai/resources/models.mjs';
const getUserOrCreate = async (userId, userName = null) => {
    const db = await openDatabase();
    const row = await db.get(`SELECT * FROM users WHERE id = ?`, userId);
    let threadId = null;
    let useIA = true;
    if (row) {
        const id = row.id.toString();
        threadId = row.thread_id ? row.thread_id.toString() : null;
        useIA = row.use_ia === 1;
    } else {
        await db.run(`INSERT INTO users (id, name) VALUES (?, ?)`, userId, userName);
    }
    return User(userId, userName, threadId, true); 
}

export default getUserOrCreate;
