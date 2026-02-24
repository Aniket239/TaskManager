import { db } from "../Database";

export const createTaskTable = () => {
    return db.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firestore_id TEXT,
            title TEXT NOT NULL,
            description TEXT,
            start_date_time TEXT,
            end_date_time TEXT,
            user_id TEXT,
            is_completed INTEGER DEFAULT 0,
            sync_status TEXT DEFAULT 'pending', 
            updated_at TEXT
        );
    `);
};

export const dropTaskTable = () => {
    return db.execute(`DROP TABLE IF EXISTS tasks;`);
};
