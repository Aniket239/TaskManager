import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';
import Appearance from '../modules/app/Settings/Appearance';
import AddEditTask from '../modules/app/Tasks/AddEditTask/AddEditTask.view';

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="Home" component={AppTabs} />
            <Stack.Screen name="Appearance" component={Appearance} />
            <Stack.Screen name="AddEditTask" component={AddEditTask} />
        </Stack.Navigator>
    );
}