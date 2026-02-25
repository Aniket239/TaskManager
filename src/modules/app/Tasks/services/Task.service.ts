import { AddEditTaskFormType } from "../AddEditTask/AddEditTask.modal";
import dayjs from "dayjs";
import taskRepository from "../repository/task.repository";
import { TaskType } from "../Tasks.modal";
import reminderService from "./reminder.service";
import syncService from "./sync.service";

type TaskRow = {
    id: number | string | null;
    firestore_id?: string | null;
    title: string | null;
    description?: string | null;
    start_date_time?: string | null;
    end_date_time?: string | null;
    user_id?: string | null;
    is_completed?: number | string | null;
};

type TaskLookupOptions = {
    firestore_id?: string | null;
};

const normalizeTaskRow = (row: TaskRow, fallbackUserUid = ""): TaskType => ({
    id: Number(row.id),
    firestore_id: row.firestore_id ?? null,
    title: row.title || "",
    description: row.description ?? null,
    start_date_time: row.start_date_time ?? null,
    end_date_time: row.end_date_time ?? null,
    user_id: row.user_id ?? fallbackUserUid,
    is_completed: Number(row.is_completed) === 1 ? 1 : 0,
});

const getTaskById = async (taskId: number): Promise<TaskType | null> => {
    const result = await taskRepository.getTaskById(taskId);
    const row = (result.rows?._array?.[0] ?? null) as TaskRow | null;

    if (!row) return null;
    return normalizeTaskRow(row, row.user_id ?? "");
};

const getTaskByFirestoreId = async (firestoreId: string): Promise<TaskType | null> => {
    const result = await taskRepository.getTaskByFirestoreId(firestoreId);
    const row = (result.rows?._array?.[0] ?? null) as TaskRow | null;

    if (!row) return null;
    return normalizeTaskRow(row, row.user_id ?? "");
};

const resolveTask = async (taskId: number, options?: TaskLookupOptions): Promise<TaskType | null> => {
    const byId = await getTaskById(taskId);
    if (byId) return byId;

    if (!options?.firestore_id) return null;
    return getTaskByFirestoreId(options.firestore_id);
};

const createTask = async (data: AddEditTaskFormType, userUid: string) => {
    if (dayjs(data.endDateTime).isBefore(data.startDateTime)) {
        throw new Error("End date must be after start date");
    }

    const now = new Date().toISOString();
    const startDateTimeIso = dayjs(data.startDateTime).toISOString();
    const endDateTimeIso = dayjs(data.endDateTime).toISOString();

    const result = await taskRepository.insertTask({
        title: data.title,
        description: data.description,
        start_date_time: startDateTimeIso,
        end_date_time: endDateTimeIso,
        user_id: userUid,
        is_completed: 0,
        sync_status: "pending",
        updated_at: now,
    });

    const createdTaskId = Number((result as { insertId?: number }).insertId);
    if (!Number.isNaN(createdTaskId)) {
        await reminderService.scheduleTaskReminder({
            id: createdTaskId,
            title: data.title,
            start_date_time: startDateTimeIso,
            is_completed: 0,
        });
    }

    await syncService.syncTasks();

    return result;
};

const getTasksByUser = async (userUid: string): Promise<TaskType[]> => {
    const result = await taskRepository.getTasksByUser(userUid);
    const rows = (result.rows?._array || []) as TaskRow[];

    return rows.map((row) => normalizeTaskRow(row, userUid));
};

const updateTask = async (
    taskId: number,
    updates: Partial<AddEditTaskFormType & { is_completed?: number }>,
    options?: TaskLookupOptions
) => {
    const currentTask = await resolveTask(taskId, options);
    if (!currentTask) {
        throw new Error("Task not found");
    }

    const targetTaskId = currentTask.id;
    const payload: Record<string, any> = { ...updates };

    // Convert dates if provided
    if (updates.startDateTime !== undefined) {
        payload.start_date_time = updates.startDateTime ? dayjs(updates.startDateTime).toISOString() : null;
        delete payload.startDateTime;
    }

    if (updates.endDateTime !== undefined) {
        payload.end_date_time = updates.endDateTime ? dayjs(updates.endDateTime).toISOString() : null;
        delete payload.endDateTime;
    }

    const nextStartDateTime = payload.start_date_time ?? currentTask.start_date_time;
    const nextEndDateTime = payload.end_date_time ?? currentTask.end_date_time;

    if (nextStartDateTime && nextEndDateTime && dayjs(nextEndDateTime).isBefore(nextStartDateTime)) {
        throw new Error("End date must be after start date");
    }

    payload.sync_status = "pending";
    payload.updated_at = new Date().toISOString();

    const result = await taskRepository.updateTask(targetTaskId, payload);

    const nextTask: TaskType = {
        ...currentTask,
        title: payload.title ?? currentTask.title,
        description: payload.description ?? currentTask.description,
        start_date_time: nextStartDateTime ?? null,
        end_date_time: nextEndDateTime ?? null,
        is_completed:
            payload.is_completed !== undefined
                ? Number(payload.is_completed) === 1
                    ? 1
                    : 0
                : currentTask.is_completed,
    };

    if (nextTask.is_completed === 1) {
        await reminderService.cancelTaskReminder(targetTaskId);
    } else {
        await reminderService.scheduleTaskReminder(nextTask);
    }

    await syncService.syncTasks();

    return result;
};

const deleteTask = async (taskId: number, options?: TaskLookupOptions) => {
    const currentTask = await resolveTask(taskId, options);
    if (!currentTask) {
        throw new Error("Task not found");
    }

    await taskRepository.updateTask(currentTask.id, {
        sync_status: "deleted",
        updated_at: new Date().toISOString(),
    });

    await reminderService.cancelTaskReminder(currentTask.id);
    await syncService.syncTasks();
};

export default {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask
};
