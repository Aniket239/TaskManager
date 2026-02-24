import React from 'react';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    FadeOutDown,
    FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsiveHeight, responsiveWidth } from '../utils/responsiveDimension';
import { DarkTheme } from '../styles/Theme';
import { FontSize } from '../styles/FontSize';
import { useTheme } from '../hooks/ThemeContext';

const { width } = Dimensions.get('window');

const fadeInDown = FadeInDown.delay(100).duration(200);
const fadeInUp = FadeInUp.delay(100).duration(200);
const fadeOutUp = FadeOutUp.delay(100).duration(200);
const fadeOutDown = FadeOutDown.delay(100).duration(200);

type ToastType = {
    message: string,
    options: {
        duration?: number,
        position?: 'top' | 'bottom',
        type: 'success' | 'error' | 'warning' | 'info',
    }
}

export const Toast = ({ message, options }: ToastType) => {
    const { font, themeStyles, accentColor } = useTheme();
    const position = options?.position || 'bottom'; // 👈 fallback to 'bottom'

    const entering = position === 'bottom' ? fadeInDown : fadeInUp;
    const exiting = position === 'bottom' ? fadeOutUp : fadeOutDown;
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        toastContainer: {
            position: 'absolute',
            ...(position === 'top'
                ? { top: responsiveHeight(6) }
                : { bottom: insets.bottom + 20 }),
            left: '0%',
            // maxWidth: width * 0.8,
            // padding: 12,
            width: responsiveWidth(100),
            zIndex: 1000,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dataContainer: {
            width: width * 0.8,
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            // backgroundColor: theme === 'light' ? CommonTheme.modalOverlay : CommonTheme.modalOverlay,
            // backgroundColor: options.type === 'success' ? themeStyles.successBackground : options.type === 'error' ? themeStyles.errorBackground : options.type === 'warning' ? themeStyles.warningBackground : accentColor,
            backgroundColor: themeStyles.toast,
            borderRadius: 7,
            paddingLeft: 15,
            paddingRight: 15,
            paddingVertical: 15,
            maxWidth: 500,
            overflow: 'hidden',
        },
        toastIconContainer: {
            width: 30,
            height: 30,
            backgroundColor: DarkTheme.background,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        toastIcon: {
            width: 18,
            height: 18,
            objectFit: 'contain',
            marginTop: -2
        },
        toastIndicator: {
            // flex: 1,
            // height: '100%',
            alignSelf: 'stretch',
            width: 3,
            backgroundColor: options.type === 'success' ? themeStyles.success : options.type === 'error' ? themeStyles.error : options.type === 'warning' ? themeStyles.warning : accentColor,
            borderRadius: 50,
        },
        toastText: {
            // maxWidth: '90%',
            color: DarkTheme.text,
            fontSize: FontSize.large,
            textAlign: 'left',
            fontFamily: font,
        },
    });

    return (
        <Animated.View
            entering={entering}
            exiting={exiting}
            style={[
                styles.toastContainer,
            ]}
            pointerEvents="none"
        >
            <View style={styles.dataContainer}>
                <View style={styles.toastIndicator} />
                <Text allowFontScaling={false} style={styles.toastText}>{message}</Text>
            </View>
        </Animated.View>
    );
};
