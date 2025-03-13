const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
  client: process.env.DB_CONNECTION, // Detecta la base de datos (mysql o sqlite3)
};

if (process.env.DB_CONNECTION === 'sqlite3') {
  dbConfig.connection = {
    filename: process.env.DB_DATABASE || './database.sqlite', // Archivo SQLite
  };
  dbConfig.useNullAsDefault = true; // Necesario para SQLite
} else if (process.env.DB_CONNECTION === 'mysql') {
  dbConfig.connection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    timezone: 'Z'
  };
}

dbConfig.migrations = {
  directory: './src/database/migrations',
};

module.exports = {
  development: dbConfig,
  production: dbConfig, // Puedes agregar más configuraciones según el entorno
};
