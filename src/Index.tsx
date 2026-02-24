import { View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from './hooks/ThemeContext';
import { getGlobalStyles } from './styles/globalStyles';
import NoInternetBanner from './components/NoInternetBanner';
import NetInfo from '@react-native-community/netinfo';
import RootNavigator from './navigation/RootNavigator';
import { createTaskTable } from './database/migrations/task.migration';
import syncService from './modules/app/Tasks/services/sync.service';
import reminderService from './modules/app/Tasks/services/reminder.service';
import TaskService from './modules/app/Tasks/services/Task.service';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

const Index = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [dbReady, setDbReady] = useState(false);
    const userUid = useSelector((state: RootState) => state.auth.user?.uid ?? null);
    const { isDark } = useTheme();
    const globalStyles = getGlobalStyles();
    const syncRemindersForUser = async (uid: string | null) => {
        if (!uid) {
            await reminderService.clearAllTaskReminders();
            return;
        }

        const tasks = await TaskService.getTasksByUser(uid);
        await reminderService.syncTaskReminders(tasks);
    };

    useEffect(() => {
        let isMounted = true;

        const initializeDb = async () => {
            await createTaskTable();
            if (isMounted) {
                setDbReady(true);
            }
        };

        // const initializeApp = async () => {
        //     await BootSplash.hide({ fade: true });
        // };
        reminderService.initialize().catch((error) => {
            console.log("Failed to initialize reminders:", error);
        });

        initializeDb().catch((error) => {
            console.log("Failed to initialize tasks table:", error);
        });
        // dropTaskTable();
        // initializeApp().catch(console.error);
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!dbReady) return;

        syncService
            .syncUserData(userUid)
            .then(() => syncRemindersForUser(userUid))
            .catch((error) => {
                console.log("User data sync failed:", error);
            });
    }, [dbReady, userUid]);

    useEffect(() => {
        if (!dbReady || !isConnected || !userUid) return;

        syncService
            .syncUserData(userUid)
            .then(() => syncRemindersForUser(userUid))
            .catch((error) => {
                console.log("User reconnect sync failed:", error);
            });
    }, [dbReady, isConnected, userUid]);

    return (
        <View style={globalStyles.container}>
            <StatusBar
                animated
                translucent
                showHideTransition={'slide'}
                backgroundColor="transparent"
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />
            {/* <Loader visible={isLoading} /> */}
            <NoInternetBanner isConnected={isConnected} />
            <RootNavigator />
        </View>
    )
}

export default Index
