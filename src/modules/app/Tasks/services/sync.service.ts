import NetInfo from "@react-native-community/netinfo";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import taskRepository from "../repository/task.repository";

let syncQueue: Promise<void> = Promise.resolve();

const runSyncJob = (job: () => Promise<void>) => {
    syncQueue = syncQueue
        .catch(() => undefined)
        .then(job);

    return syncQueue;
};

const getTaskDocId = (task: any) => {
    if (task.firestore_id) return task.firestore_id;
    const userId = task.user_id || "anonymous";
    return `${userId}_${task.id}`;
};

const pushPendingTasks = async () => {
    const pendingTasks = await taskRepository.getPendingTasks();

    for (const task of pendingTasks.rows._array) {
        const taskId = Number(task.id);
        if (Number.isNaN(taskId)) {
            console.log("Skipping task with invalid id:", task.id);
            continue;
        }

        try {
            if (task.sync_status === "deleted") {
                await deleteDoc(doc(firestore, "tasks", getTaskDocId({ ...task, id: taskId })));
                await taskRepository.hardDelete(taskId);
                continue;
            }

            const firestoreId = getTaskDocId({ ...task, id: taskId });
            const docRef = doc(firestore, "tasks", firestoreId);

            await setDoc(docRef, {
                title: task.title,
                description: task.description,
                start_date_time: task.start_date_time,
                end_date_time: task.end_date_time,
                user_id: task.user_id,
                is_completed: task.is_completed,
                updated_at: task.updated_at,
            });

            await taskRepository.markAsSynced(taskId, firestoreId);
        } catch (error: any) {
            console.log("Sync failed for task:", taskId, error);
        }
    }
};

const pullTasksByUser = async (userId: string) => {
    const tasksRef = collection(firestore, "tasks");
    const q = query(tasksRef, where("user_id", "==", userId));
    const snapshot = await getDocs(q);

    await taskRepository.deleteTasksByUser(userId);

    for (const taskDoc of snapshot.docs) {
        const task = taskDoc.data() as any;

        await taskRepository.insertTask({
            firestore_id: taskDoc.id,
            title: task?.title ?? "",
            description: task?.description ?? null,
            start_date_time: task?.start_date_time ?? null,
            end_date_time: task?.end_date_time ?? null,
            user_id: userId,
            is_completed: Number(task?.is_completed) === 1 ? 1 : 0,
            sync_status: "synced",
            updated_at: task?.updated_at ?? new Date().toISOString(),
        });
    }
};

const syncTasks = async () => {
    return runSyncJob(async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) return;
        await pushPendingTasks();
    });
};

const syncUserData = async (userId: string | null) => {
    return runSyncJob(async () => {
        if (!userId) {
            await taskRepository.clearAllTasks();
            return;
        }

        await taskRepository.deleteTasksNotForUser(userId);

        const state = await NetInfo.fetch();
        if (!state.isConnected) return;

        await pushPendingTasks();
        await pullTasksByUser(userId);
    });
};

export default {
    syncTasks,
    syncUserData
};
