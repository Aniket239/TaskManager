import notifee, {
    AndroidImportance,
    TimestampTrigger,
    TriggerType,
} from "@notifee/react-native";
import dayjs from "dayjs";
import { Platform } from "react-native";
import { TaskType } from "../Tasks.modal";

const TASK_REMINDER_CHANNEL_ID = "task-reminders";
const TASK_REMINDER_CHANNEL_NAME = "Task Reminders";
const TASK_REMINDER_PREFIX = "task-reminder";

type ReminderTask = Pick<TaskType, "id" | "title" | "start_date_time" | "is_completed">;

const getTaskReminderNotificationId = (taskId: number | string) =>
    `${TASK_REMINDER_PREFIX}-${taskId}`;

const ensureReminderChannel = async () => {
    if (Platform.OS !== "android") return;

    await notifee.createChannel({
        id: TASK_REMINDER_CHANNEL_ID,
        name: TASK_REMINDER_CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
    });
};

const initialize = async () => {
    try {
        await notifee.requestPermission();
        await ensureReminderChannel();
    } catch (error) {
        console.log("Notifee initialize failed:", error);
    }
};

const shouldScheduleReminder = (task: ReminderTask): boolean => {
    if (!task.start_date_time) return false;
    if (Number(task.is_completed) === 1) return false;

    const triggerAt = dayjs(task.start_date_time);
    if (!triggerAt.isValid()) return false;

    return triggerAt.isAfter(dayjs());
};

const cancelTaskReminder = async (taskId: number | string) => {
    try {
        await notifee.cancelNotification(getTaskReminderNotificationId(taskId));
    } catch (error) {
        console.log("Failed to cancel task reminder:", error);
    }
};

const scheduleTaskReminder = async (task: ReminderTask) => {
    try {
        const notificationId = getTaskReminderNotificationId(task.id);
        await notifee.cancelNotification(notificationId);

        if (!shouldScheduleReminder(task)) return;

        await ensureReminderChannel();

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: dayjs(task.start_date_time).valueOf(),
        };

        await notifee.createTriggerNotification(
            {
                id: notificationId,
                title: "Task Reminder",
                body: `It's time to start: ${task.title}`,
                android: {
                    channelId: TASK_REMINDER_CHANNEL_ID,
                    smallIcon: "ic_launcher",
                    pressAction: {
                        id: "default",
                    },
                },
            },
            trigger
        );
    } catch (error) {
        console.log("Failed to schedule task reminder:", error);
    }
};

const syncTaskReminders = async (tasks: ReminderTask[]) => {
    try {
        const triggerIds = await notifee.getTriggerNotificationIds();
        const currentReminderIds = new Set(
            tasks.filter(shouldScheduleReminder).map((task) => getTaskReminderNotificationId(task.id))
        );

        for (const triggerId of triggerIds) {
            if (triggerId.startsWith(TASK_REMINDER_PREFIX) && !currentReminderIds.has(triggerId)) {
                await notifee.cancelNotification(triggerId);
            }
        }

        for (const task of tasks) {
            await scheduleTaskReminder(task);
        }
    } catch (error) {
        console.log("Failed to sync task reminders:", error);
    }
};

const clearAllTaskReminders = async () => {
    try {
        const triggerIds = await notifee.getTriggerNotificationIds();
        const reminderIds = triggerIds.filter((triggerId) => triggerId.startsWith(TASK_REMINDER_PREFIX));

        for (const reminderId of reminderIds) {
            await notifee.cancelNotification(reminderId);
        }
    } catch (error) {
        console.log("Failed to clear task reminders:", error);
    }
};

export default {
    initialize,
    scheduleTaskReminder,
    cancelTaskReminder,
    syncTaskReminders,
    clearAllTaskReminders,
};
