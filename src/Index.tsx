import { View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from './hooks/ThemeContext';
import { getGlobalStyles } from './styles/globalStyles';
import NoInternetBanner from './components/NoInternetBanner';
import NetInfo from '@react-native-community/netinfo';
import RootNavigator from './navigation/RootNavigator';

const Index = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const { isDark } = useTheme();
    const globalStyles = getGlobalStyles();

    useEffect(() => {
        // const initializeApp = async () => {
        //     await BootSplash.hide({ fade: true });
        // };

        // initializeApp().catch(console.error);

        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);
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