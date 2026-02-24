import { AddEditTaskFormType } from "../AddEditTask/AddEditTask.modal";
import dayjs from "dayjs";
import taskRepository from "../repository/task.repository";
import { TaskType } from "../Tasks.modal";

const createTask = async (data: AddEditTaskFormType, userUid: string) => {
    if (dayjs(data.endDateTime).isBefore(data.startDateTime)) {
        throw new Error("End date must be after start date");
    }

    return taskRepository.insertTask({
        title: data.title,
        description: data.description,
        start_date_time: dayjs(data.startDateTime).toISOString(),
        end_date_time: dayjs(data.endDateTime).toISOString(),
        user_id: userUid,
    });
};

const getTasksByUser = async (userUid: string): Promise<TaskType[]> => {
    const result = taskRepository.getTasksByUser(userUid);
    return (result.rows?._array || []) as TaskType[];
};

const updateTask = async (
    taskId: number,
    updates: Partial<AddEditTaskFormType & { is_completed?: number }>
) => {

    const payload: any = { ...updates };

    // Convert dates if provided
    if (updates.startDateTime) {
        payload.start_date_time = dayjs(updates.startDateTime).toISOString();
        delete payload.startDateTime;
    }

    if (updates.endDateTime) {
        payload.end_date_time = dayjs(updates.endDateTime).toISOString();
        delete payload.endDateTime;
    }

    // Validate if both dates exist
    if (updates.startDateTime && updates.endDateTime) {
        if (dayjs(updates.endDateTime).isBefore(updates.startDateTime)) {
            throw new Error("End date must be after start date");
        }
    }

    return taskRepository.updateTask(taskId, payload);
};

const deleteTask = async (taskId: number) => {
    if (!taskId) {
        throw new Error("Invalid task id");
    }

    return taskRepository.deleteTask(taskId);
};


export default {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask
};
