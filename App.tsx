/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider, useDispatch } from 'react-redux'
import { AppDispatch, store } from './src/redux/store'
import { ThemeProvider } from './src/hooks/ThemeContext'
import { ToastProvider } from './src/hooks/ToastContext'
import Index from './src/Index'
import { setUser } from './src/redux/slices/authSlice'
import auth from '@react-native-firebase/auth';
import { KeyboardProvider } from "react-native-keyboard-controller";

const AuthListener = ({ children }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      dispatch(setUser(user));
    });

    return subscriber;
  }, []);

  return children;
};
const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AuthListener>
          <ThemeProvider>
            <ToastProvider>
              <KeyboardProvider>
                <Index />
              </KeyboardProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthListener>
      </Provider>
    </SafeAreaProvider>
  )
}

export default App