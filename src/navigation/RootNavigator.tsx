import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { RootState } from '../redux/store';

export default function RootNavigator() {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <NavigationContainer>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}