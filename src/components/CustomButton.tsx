/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
    TextStyle,
    View,
    Vibration,
    Image,
    ImageProps,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import { FontSize } from '../styles/FontSize';
import generateShades from '../styles/generateAccentShades';
import { CommonTheme, DarkTheme } from '../styles/Theme';

type ButtonVariant = 'primary' | 'secondary';

interface Props {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: ButtonVariant;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: ImageProps
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CustomButton: React.FC<Props> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
    textStyle,
    variant = 'primary',
    icon,
}) => {
    const { theme, font, accentColor, selectedFontSize, themeStyles } = useTheme();
    const isDark = theme === 'dark';
    const accentShades = generateShades(accentColor);

    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withTiming(0.95, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 100 });
    };

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const styles = StyleSheet.create({
        button: {
            width: '100%',
            marginHorizontal: 'auto',
            marginVertical: 10,
            height: 45,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: variant === 'primary' ? 0 : 1,
            borderColor: variant === 'primary' ? undefined : accentColor,
            gap: 10,
            marginTop: 20,
        },
        buttonText: {
            // width: '100%',
            color: CommonTheme.white,
            textAlign: 'center',
            fontSize: FontSize.button * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : undefined,
            fontWeight: font !== 'Default' ? undefined : '500',
        },
        icon: {
            width: 15,
            height: 15,
            resizeMode: 'contain',
            tintColor: CommonTheme.white
        }
    });

    return (
        <AnimatedTouchable
            style={[animatedButtonStyle, style]}
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={(e) => { onPress(e); Platform.OS === 'android' && Vibration.vibrate(10); }}
            disabled={disabled || loading}
            accessibilityRole="button"
        >
            {variant === "primary" ? (
                <LinearGradient
                    colors={[
                        disabled ? themeStyles.disabledButton : accentColor,
                        isDark
                            ? disabled
                                ? themeStyles.disabledButton
                                : accentShades.dark1
                            : disabled
                                ? themeStyles.disabledButton
                                : accentShades.light1,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, style]}
                >
                    {loading ? (
                        <ActivityIndicator color={DarkTheme.text} size="small" />
                    ) : (
                        <Text allowFontScaling={false} style={[styles.buttonText, textStyle]}>
                            {title}
                        </Text>
                    )}
                    {icon &&
                        <Image style={styles.icon} source={icon} />
                    }
                </LinearGradient>
            ) : (
                <View
                    style={[
                        styles.button,
                        {
                            backgroundColor: 'transparent',
                            borderColor: accentColor,
                            borderWidth: 1,
                        },
                        style,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={DarkTheme.text} size='small' />
                    ) : (
                        <>
                            <Text
                                allowFontScaling={false}
                                style={[
                                    styles.buttonText,
                                    { color: accentColor }, // text color matches accent
                                    textStyle,
                                ]}
                            >
                                {title}
                            </Text>
                            {icon &&
                                <Image style={styles.icon} source={icon} />
                            }
                        </>
                    )}
                </View>
            )}
        </AnimatedTouchable>
    );
};

export default CustomButton;
