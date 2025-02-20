import openDatabase from './open.js';

const createDatabase = async () => {
    const db = await openDatabase();
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        use_ia INTEGER DEFAULT 1,
        thread_id TEXT
    )`);
    await db.exec(`CREATE TABLE IF NOT EXISTS appointments (
        user_id TEXT PRIMARY KEY,
        appointment_date TEXT
        service_time INT
    )`);
    return db;
};


// Ejecutar automáticamente si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    createDatabase().then(() => {
        console.log("Base de datos creada correctamente.");
    }).catch(err => {
        console.error("Error al crear la base de datos:", err);
    });
}

export default createDatabase;