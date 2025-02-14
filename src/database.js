import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDb() {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
}

async function setupDb() {
    const db = await openDb();
    await db.exec(`CREATE TABLE IF NOT EXISTS assistants (
        user_id TEXT PRIMARY KEY,
        assistant_id TEXT NOT NULL,
        thread_id TEXT NOT NULL
    )`);
    return db;
}

async function saveAssistantAndThreadId(userId, assistantId, threadId) {
    const db = await setupDb();
    await db.run(`INSERT INTO assistants (user_id, assistant_id, thread_id) VALUES (?, ?, ?)
                 ON CONFLICT(user_id) DO UPDATE SET assistant_id = excluded.assistant_id, thread_id = excluded.thread_id;`,
                 userId, assistantId, threadId);
    console.log(`Registro actualizado con el ID del asistente: ${assistantId} y ID del hilo: ${threadId}`);
}

async function getAssistantAndThreadId(userId) {
    const db = await setupDb();
    const row = await db.get(`SELECT assistant_id, thread_id FROM assistants WHERE user_id = ?`, userId);
    return row ? { id: row.assistant_id.toString(), threadId: row.thread_id.toString() } : null;
}

export default { saveAssistantAndThreadId, getAssistantAndThreadId };
