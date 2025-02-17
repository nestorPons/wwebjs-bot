import openDatabase from './open.js';

const deleteThreadId = async (userId) => {
    const db = await openDatabase();
    const row = await db.get(`UPDATE users SET thread_id = NULL WHERE id = ?;`, userId);
    return row ? row.thread_id.toString() : null;
}

// Verificar si el script se está ejecutando directamente desde la consola
if (import.meta.url === `file://${process.argv[1]}`) {
    const userId = process.argv[2]; 
    if (!userId) {
        console.error("Hilo eliminado correctamente.");
        process.exit(1);
    }

    deleteThreadId(userId)
        .then(threadId => {
            console.log(threadId ?? "Eliminado thread_id del usuario.");
            process.exit(0);
        })
        .catch(err => {
            console.error("Error:", err);
            process.exit(1);
        });
}

export default deleteThreadId;

