import openDatabase from './open.js'

const createAppointment = async (userId, date, hour) => {
    const db = await openDatabase();
    await db.run(`INSERT INTO appointment (id,) VALUES (?, ?)
                 ON CONFLICT(id) DO UPDATE SET thread_id = excluded.thread_id;`,
                 userId, threadId);
    console.log(`Registro actualizado ID del hilo: ${threadId}`);
}

export default setThreadId;
