import { Image, ImageProps, Platform, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/ThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';
import { CommonTheme } from '../styles/Theme';

type FloatingButtonType = {
    buttonStyle?: ViewStyle;
    onPress: () => void;
    title?: string,
    icon?: ImageProps
}

const FloatingButton = ({
    buttonStyle,
    onPress,
    title,
    icon = require('../assets/images/common/add.png')
}: FloatingButtonType) => {
    const globalStyles = getGlobalStyles();
    const { accentColor } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        button: {
            backgroundColor: accentColor,
            paddingVertical: title ? 15 : 20,
            paddingHorizontal: title ? 18 : 20,
            borderRadius: title ? 10 : 100,
            position: 'absolute',
            bottom: insets.bottom + (Platform.OS === 'ios' ? 0 : 20),
            right: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        icon: {
            width: title ? 15 : 20,
            height: title ? 15 : 20,
            objectFit: 'contain',
            tintColor: CommonTheme.white,
        }
    })

    return (
        <TouchableOpacity activeOpacity={0.7} style={[styles.button, buttonStyle]} onPress={onPress}>
            <Image style={styles.icon} source={icon} />
            {title &&
                <Text allowFontScaling={false} style={[globalStyles.cardValue, { color: CommonTheme.white }]}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

export default FloatingButton

