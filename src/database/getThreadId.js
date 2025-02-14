import openDatabase from './open.js';

const getThreadId = async (userId) => {
    const db = await openDatabase();
    const row = await db.get(`SELECT thread_id FROM assistants WHERE user_id = ?`, userId);
    return row ? row.thread_id.toString() : null;
}

export default getThreadId;
