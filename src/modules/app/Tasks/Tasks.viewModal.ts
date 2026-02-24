import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import TaskService from "./services/Task.service";
import { TaskType, TasksViewModalType } from "./Tasks.modal";
import { useToast } from "../../../hooks/ToastContext";
import syncService from "./services/sync.service";
import reminderService from "./services/reminder.service";

const useTaskViewModal = (): TasksViewModalType => {
    const navigation = useNavigation<any>();
    const userUid = useSelector((state: RootState) => state.auth.user?.uid);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const loadTasks = useCallback(async () => {
        if (!userUid) {
            setTasks([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            try {
                await syncService.syncUserData(userUid);
            } catch (syncError) {
                console.log("Task sync before load failed:", syncError);
            }

            const data = await TaskService.getTasksByUser(userUid);
            setTasks(data);
            await reminderService.syncTaskReminders(data);
        } catch (error: any) {
            console.error(error);
            showToast(error.message || "Failed to load tasks", {
                type: "error",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    }, [userUid, showToast]);

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [loadTasks])
    );

    const addTask = () => {
        navigation.navigate('AddEditTask', { task: null })
    }

    const changeStatus = async (taskId: number, is_completed: number) => {
        try {
            const response = await TaskService.updateTask(taskId, { is_completed: is_completed === 1 ? 0 : 1 });
            await loadTasks();
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            if (is_completed === 0) {
                showToast("Task marked as completed", {
                    type: "success",
                    duration: 3000
                });
            }
            else {
                showToast("Task marked as incomplete", {
                    type: "success",
                    duration: 3000
                });
            }
        } catch (error: any) {
            console.error(error);
            showToast(error.message || "Failed to update task", {
                type: "error",
                duration: 5000
            });
        }
    }

    const deleteTask = async (taskId: number) => {
        try {
            await TaskService.deleteTask(taskId);
            await loadTasks(); // refresh list
            showToast("Task deleted successfully", {
                type: "success",
                duration: 3000
            });
        } catch (error: any) {
            console.error(error);
            showToast(error.message || "Failed to delete task", {
                type: "error",
                duration: 5000
            });
        }
    };
    return {
        addTask,
        tasks,
        loading,
        refreshTasks: loadTasks,
        changeStatus,
        deleteTask
    }
}

export default useTaskViewModal
