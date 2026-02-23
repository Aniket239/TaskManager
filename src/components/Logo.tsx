import { Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/ThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';

const Logo = () => {
    const { accentColor } = useTheme();
    const globalStyles = getGlobalStyles();

    return (
        <View>
            <Text allowFontScaling={false} style={globalStyles.logo}>Agent<Text style={{ color: accentColor }}>CRM</Text></Text>
        </View>
    )
}

export default Logo
