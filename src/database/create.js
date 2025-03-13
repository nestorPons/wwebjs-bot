import sqlite3 from 'sqlite3';
import { open as sqliteOpen } from 'sqlite';
import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

const createDatabase = async () => {
    if (process.env.DB_CONNECTION === 'sqlite3') {
        const db = await sqliteOpen({
            filename: process.env.DB_DATABASE,
            driver: sqlite3.Database
        });
        return db;
    }
};


// Ejecutar automáticamente si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    createDatabase().then(() => {
        console.log("Base de datos creada correctamente.");
        const command = `npx knex --knexfile=knexfile.cjs migrate:latest`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`⚠️ Stderr: ${stderr}`);
                return;
            }
            console.log(`📂 Salida:\n${stdout}`);
        });
    }).catch(err => {
        console.error("Error al crear la base de datos:", err);
    });
}

export default createDatabase;