import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../modules/auth/Login/Login.view';

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            {/* <Stack.Screen name="Signup" component={Signup} /> */}
        </Stack.Navigator>
    );
}