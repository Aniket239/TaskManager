import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getGlobalStyles } from '../../../styles/globalStyles'
import Navbar from '../../../components/Navbar';
import FloatingButton from '../../../components/FloatingButton';
import useTaskViewModal from './Tasks.viewModal';
import { useTheme } from '../../../hooks/ThemeContext';
import TaskCard from './components/TaskCard';
import { refreshColors } from '../../../styles/Theme';

const Tasks = () => {
    const globalStyles = getGlobalStyles();
    const { themeStyles } = useTheme();
    const { addTask, tasks, loading, refreshTasks, changeStatus, deleteTask } = useTaskViewModal();

    return (
        <View style={globalStyles.container}>
            <Navbar title='Tasks' hideBackButton />
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.firestore_id || String(item.id)}
                contentContainerStyle={[
                    globalStyles.listContainer,
                    tasks.length === 0 ? styles.emptyContainer : null
                ]}
                renderItem={({ item }) => (
                    <TaskCard task={item} changeStatus={changeStatus} deleteTask={deleteTask} />
                )}
                refreshing={loading}
                onRefresh={refreshTasks}
                refreshControl={<RefreshControl refreshing={loading} colors={refreshColors} />}
                ListFooterComponent={
                    tasks.length > 0 ?
                        <Text allowFontScaling={false} style={globalStyles.noDataText}>
                            No more tasks
                        </Text>
                        :
                        null
                }
                ListEmptyComponent={
                    <View style={globalStyles.noDataContainer}>
                        {loading ? (
                            <ActivityIndicator color={themeStyles.text} />
                        ) : (
                            <Text allowFontScaling={false} style={globalStyles.noDataText}>
                                No tasks yet. Tap "Add Task" to create one.
                            </Text>
                        )}
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
            <FloatingButton title='Add Task' onPress={addTask} />
        </View>
    )
}

export default Tasks

const styles = StyleSheet.create({
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    }
})
