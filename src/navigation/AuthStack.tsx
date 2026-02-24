import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../modules/auth/Login/Login.view';
import SignUp from '../modules/auth/SignUp/SignUp.view';

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
    );
}