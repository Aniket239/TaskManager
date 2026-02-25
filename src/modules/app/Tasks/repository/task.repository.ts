import { db } from "../../../../database/Database";

const insertTask = (task: any) => {
    return db.execute(`
        INSERT INTO tasks 
        (firestore_id, title, description, start_date_time, end_date_time, user_id, is_completed, sync_status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
        task.firestore_id ?? null,
        task.title,
        task.description,
        task.start_date_time,
        task.end_date_time,
        task.user_id,
        task.is_completed ?? 0,
        task.sync_status ?? "pending",
        task.updated_at ?? new Date().toISOString(),
    ]);
};

const getAllTasks = () => {
    return db.execute(`SELECT * FROM tasks;`);
};

const getTasksByUser = (user_id: string) => {
    return db.execute(
        `SELECT * FROM tasks WHERE user_id = ? ORDER BY start_date_time ASC, id DESC;`,
        [user_id]
    );
};

const getTaskById = (taskId: number) => {
    return db.execute(
        `SELECT * FROM tasks WHERE id = ? LIMIT 1;`,
        [taskId]
    );
};

const getTaskByFirestoreId = (firestoreId: string) => {
    return db.execute(
        `SELECT * FROM tasks WHERE firestore_id = ? LIMIT 1;`,
        [firestoreId]
    );
};

const updateTask = (
    taskId: number,
    updates: Record<string, any>
) => {
    const fields = Object.keys(updates);

    if (fields.length === 0) return;

    const setClause = fields.map(field => `${field} = ?`).join(", ");

    const values = fields.map(field => updates[field]);

    return db.execute(
        `UPDATE tasks 
     SET ${setClause} 
     WHERE id = ?;`,
        [...values, taskId]
    );
};

const deleteTask = (taskId: number) => {
    return db.execute(
        `DELETE FROM tasks WHERE id = ?;`,
        [taskId]
    );
};

const getPendingTasks = () => {
    return db.execute(
        `SELECT * FROM tasks WHERE sync_status != 'synced';`
    );
};

const markAsSynced = (id: number, firestoreId: string) => {
    return db.execute(
        `UPDATE tasks 
         SET sync_status = 'synced', firestore_id = ?
         WHERE id = ?;`,
        [firestoreId, id]
    );
};

const hardDelete = (id: number) => {
    return db.execute(`DELETE FROM tasks WHERE id = ?;`, [id]);
};

const deleteTasksByUser = (userId: string) => {
    return db.execute(`DELETE FROM tasks WHERE user_id = ?;`, [userId]);
};

const deleteTasksNotForUser = (userId: string) => {
    return db.execute(`DELETE FROM tasks WHERE user_id IS NULL OR user_id != ?;`, [userId]);
};

const deleteSyncedTasksNotInFirestoreIds = (userId: string, firestoreIds: string[]) => {
    if (firestoreIds.length === 0) {
        return db.execute(
            `DELETE FROM tasks WHERE user_id = ? AND sync_status = 'synced';`,
            [userId]
        );
    }

    const placeholders = firestoreIds.map(() => "?").join(", ");

    return db.execute(
        `DELETE FROM tasks
         WHERE user_id = ?
           AND sync_status = 'synced'
           AND (firestore_id IS NULL OR firestore_id NOT IN (${placeholders}));`,
        [userId, ...firestoreIds]
    );
};

const clearAllTasks = () => {
    return db.execute(`DELETE FROM tasks;`);
};

export default {
    insertTask,
    getAllTasks,
    getTasksByUser,
    getTaskById,
    getTaskByFirestoreId,
    updateTask,
    deleteTask,
    getPendingTasks,
    markAsSynced,
    hardDelete,
    deleteTasksByUser,
    deleteTasksNotForUser,
    deleteSyncedTasksNotInFirestoreIds,
    clearAllTasks
};
