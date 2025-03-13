import { Model } from 'objection';
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_CONNECTION) {
    throw new Error('DB_CONNECTION is not defined. Please set this environment variable.');
}

let db;

switch (process.env.DB_CONNECTION) {
    case 'mysql':
        db = knex({
            client: 'mysql2',
            connection: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            },
        });
        break;
    case 'sqlite3':
        db = knex({
            client: 'sqlite3',
            connection: {
                filename: process.env.DB_DATABASE,
            },
            useNullAsDefault: true
        });
        break;
    default:
        throw new Error('Invalid DB_CONNECTION value. Please set it to "mysql" or "sqlite".');
}

// Asignar la conexión a Objection.js
Model.knex(db);

// Exportar la instancia de Knex y Model para usarlo en otros archivos
export { db, Model };
