export interface TaskType {
    id: number;
    firestore_id: string | null;
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
    changeStatus: (task: TaskType) => void;
    deleteTask: (task: TaskType) => void
}


export interface TaskCardType {
    task: TaskType,
    changeStatus: (task: TaskType) => void,
    deleteTask: (task: TaskType) => void
}
