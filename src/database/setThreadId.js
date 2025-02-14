import openDatabase from './open.js'

const setThreadId = async (userId, threadId) => {
    const db = await openDatabase();
    await db.run(`INSERT INTO users (user_id, thread_id) VALUES (?, ?)
                 ON CONFLICT(user_id) DO UPDATE SET thread_id = excluded.thread_id;`,
                 userId, threadId);
    console.log(`Registro actualizado ID del hilo: ${threadId}`);
}

export default setThreadId;
