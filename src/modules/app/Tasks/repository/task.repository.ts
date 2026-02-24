import { db } from "../../../../database/Database";

const insertTask = (task: any) => {
    db.execute(`
        INSERT INTO tasks 
        (title, description, start_date_time, end_date_time, user_id)
        VALUES (?, ?, ?, ?, ?);
    `, [
        task.title,
        task.description,
        task.start_date_time,
        task.end_date_time,
        task.user_id,
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

export default {
    insertTask,
    getAllTasks,
    getTasksByUser,
    updateTask,
    deleteTask
};
