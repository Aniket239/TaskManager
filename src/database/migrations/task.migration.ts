import { db } from "../Database";

export const createTaskTable = () => {
    db.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            start_date_time TEXT,
            end_date_time TEXT,
            user_id TEXT,
            is_completed INTEGER DEFAULT 0
        );
    `);
};

export const dropTaskTable = () => {
    db.execute(`DROP TABLE IF EXISTS tasks;`);
};