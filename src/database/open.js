import sqlite3 from 'sqlite3';
import { open as sqliteOpen } from 'sqlite';

const openDatabase = async () => {
    return sqliteOpen({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
}

export default openDatabase;