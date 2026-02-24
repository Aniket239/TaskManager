/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import Tasks from '../modules/app/Tasks/Tasks.view';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from '../modules/app/Settings/Settings.view';
import BottomTabBar from '../components/BottomTabBar';
import { useTheme } from '../hooks/ThemeContext';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const { themeStyles } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: themeStyles.background }}>
            <Tab.Navigator
                initialRouteName={'Tasks'}
                tabBar={props => <BottomTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                    sceneStyle: {
                        backgroundColor: themeStyles.background,
                    },
                    lazy: true,
                }}
            >
                <Tab.Screen name="Tasks" component={Tasks} />
                <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
        </View>
    );
}