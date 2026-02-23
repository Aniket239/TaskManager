/* eslint-disable react-hooks/exhaustive-deps */
// components/NoInternetBanner.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Text,
    StyleSheet,
    Dimensions,
    ViewStyle,
    Image,
} from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { DarkTheme, LightTheme } from '../styles/Theme';
import { FontSize } from '../styles/FontSize';
import { responsiveWidth } from '../utils/responsiveDimention';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 30;

interface Props {
    isConnected: boolean | null;
}

const NoInternetBanner: React.FC<Props> = ({ isConnected }) => {
    const { font, selectedFontSize, themeStyles } = useTheme();
    const translateY = useRef(new Animated.Value(BANNER_HEIGHT)).current;
    const [bgColor, setBgColor] = useState<any>(themeStyles.success);
    const [message, setMessage] = useState<string>('');
    const [hasBeenDisconnected, setHasBeenDisconnected] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            // Went offline: slide up into view
            setHasBeenDisconnected(true);
            setMessage('No internet connection');
            setBgColor(DarkTheme.card);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else if (hasBeenDisconnected) {
            // Came back online: show green, then slide back down
            setMessage('Internet connection restored');
            setBgColor(themeStyles.success);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(translateY, {
                        toValue: BANNER_HEIGHT,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }, 1500);
            });
        }
        // if online & never disconnected: do nothing
    }, [isConnected, hasBeenDisconnected, translateY]);


    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 0,           // <-- pinned to bottom
            width,
            // adjust for Android nav bar / SafeArea if needed
            height: BANNER_HEIGHT,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            gap: responsiveWidth(3),
            // paddingBottom: insets.bottom + 10,
        },
        internetIcon: {
            tintColor: isConnected ? LightTheme.text : DarkTheme.text,
            width: responsiveWidth(6),
            height: responsiveWidth(6),
        },
        text: {
            color: isConnected ? LightTheme.text : DarkTheme.text,
            fontFamily: `${font} Medium`,
            fontSize: FontSize.medium * selectedFontSize,
        },
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.container,
                { backgroundColor: bgColor, transform: [{ translateY }] },
            ] as ViewStyle[]}
        >
            <Image style={styles.internetIcon} source={isConnected ? require('../assets/images/noInternet/internet.png') : require('../assets/images/noInternet/noInternet.png')} />
            <Text allowFontScaling={false} style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

export default NoInternetBanner;
