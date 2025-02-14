import openDatabase from './open.js';

const getUserOrCreate = async (userId) => {
    const db = await openDatabase();
    const row = await db.get(`SELECT * FROM users WHERE user_id = ?`, userId);
    if (row) {
        const id = row.user_id.toString();
        const threadId = row.thread_id ? row.thread_id.toString() : null;
        return {
            id: id,
            threadId: threadId
        };
    } else {
        await db.run(`INSERT INTO users (user_id, thread_id) VALUES (?, ?)`, userId, null);
        return {
            id: userId,
            threadId: null
        };
    }
}

export default getUserOrCreate;
