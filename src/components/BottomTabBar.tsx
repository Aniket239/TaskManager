/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize } from '../styles/FontSize';
import { useTheme } from '../hooks/ThemeContext';

const Icons: Record<string, any> = {
    Tasks: require('../assets/images/bottomNav/tasks.png'),
    Settings: require('../assets/images/bottomNav/settings.png'),
}

const ActiveIcons: Record<string, any> = {
    Tasks: require('../assets/images/bottomNav/tasksActive.png'),
    Settings: require('../assets/images/bottomNav/settingsActive.png'),
}

export const getTabIcon = (
    routeName: string,
    focused: boolean
) => {
    const icon =
        focused
            ? ActiveIcons[routeName]
            : Icons[routeName]

    return icon
}

const TAB_HEIGHT = 70;
const INDICATOR_WIDTH = 50; // 🔹 smaller than tab
const INDICATOR_HEIGHT = 3;

const BottomTabBar = ({ state, navigation }: BottomTabBarProps) => {
    const [layoutReady, setLayoutReady] = React.useState(false);
    const tabLayouts = React.useRef<{ x: number; width: number }[]>([]);
    const translateX = useSharedValue(0);
    const { themeStyles, selectedFontSize, font, accentColor } = useTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const tabWidth = width / state.routes.length;
    useEffect(() => {
        translateX.value = withTiming(
            tabWidth * state.index + (tabWidth - INDICATOR_WIDTH) / 2,
            { duration: 250 }
        );
    }, [state.index, tabWidth]);

    useEffect(() => {

        if (!layoutReady) return;

        const layout = tabLayouts.current[state.index];
        if (!layout) return;

        translateX.value = withTiming(
            layout.x + (layout.width - INDICATOR_WIDTH) / 2,
            { duration: 250 }
        );
    }, [state.index, layoutReady]);

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            height: TAB_HEIGHT + insets.bottom,
            backgroundColor: themeStyles.navbar,
            elevation: 8,
            shadowColor: themeStyles.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            paddingBottom: insets.bottom,
            paddingTop: 3,
        },
        tab: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            minWidth: 70,
        },
        icon: {
            width: 24,
            height: 24,
            tintColor: themeStyles.textSecondary,
            resizeMode: 'contain',
        },
        activeIcon: {
            tintColor: accentColor,
        },
        label: {
            fontSize: FontSize.small * selectedFontSize,
            color: themeStyles.textSecondary,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500'
        },
        activeLabel: {
            fontFamily: font !== 'Default' ? `${font} Bold` : '',
            fontWeight: font !== 'Default' ? undefined : '700',
            color: themeStyles.text,
        },
        indicator: {
            position: 'absolute',
            top: 0,
            backgroundColor: themeStyles.text,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
        },
    });

    return (
        <View style={styles.container}>
            {/* 🔹 Centered sliding indicator */}
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        width: INDICATOR_WIDTH,
                        height: INDICATOR_HEIGHT,
                    },
                    indicatorStyle,
                ]}
            />

            {state.routes.map((route: {
                name: string,
                key: string,
            }, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tab}
                        onPress={onPress}
                        activeOpacity={0.7}
                        onLayout={(e) => {
                            const { x, width } = e.nativeEvent.layout;
                            tabLayouts.current[index] = { x, width };

                            const allMeasured =
                                tabLayouts.current.filter(Boolean).length === state.routes.length;

                            if (allMeasured) {
                                setLayoutReady(true);
                            }
                        }}

                    >
                        <Image style={[styles.icon, isFocused && styles.activeIcon]} source={getTabIcon(route.name, isFocused)} />
                        <Text
                            style={[
                                styles.label,
                                isFocused && styles.activeLabel,
                            ]}
                            numberOfLines={1}
                        >
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default BottomTabBar;
