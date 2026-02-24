export interface TaskType {
    id: number;
    title: string;
    description: string | null;
    start_date_time: string | null;
    end_date_time: string | null;
    user_id: string;
    is_completed: number;
}

export interface TasksViewModalType {
    tasks: TaskType[];
    loading: boolean;
    addTask: () => void;
    refreshTasks: () => void;
    changeStatus: (taskId: number, is_completed: number) => void;
    deleteTask: (taskId: number) => void
}


export interface TaskCardType {
    task: TaskType,
    changeStatus: (taskId: number, is_completed: number) => void,
    deleteTask: (taskId: number) => void
}