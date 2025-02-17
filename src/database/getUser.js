import openDatabase from './open.js';

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
        await db.run(`INSERT INTO users (id, name) VALUES (?, ?, ?)`, userId, userName);
    }
    return {
        id: userId,
        name: userName,
        threadId: threadId,
        useIA: true
    }; 
}

export default getUserOrCreate;
