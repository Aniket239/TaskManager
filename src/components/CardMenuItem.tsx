import { Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/ThemeContext'
import { getGlobalStyles } from '../styles/globalStyles'

type CardMenuItemType = {
    type: 'EDIT' | 'DELETE' | 'STATUS',
    onPress: () => void,
    isActive?: boolean,
    title?: string
}

const CardMenuItem = ({ type, onPress, isActive, title }: CardMenuItemType) => {
    const { themeStyles } = useTheme();
    const globalStyles = getGlobalStyles();
    const buttonTitle = type === 'DELETE' ? 'Delete' : type === 'STATUS' ? isActive ? 'Deactivate' : 'Activate' : 'Edit';
    const icon = type === 'DELETE' ? require('../assets/images/common/remove.png') : type === 'STATUS' ? require('../assets/images/common/status.png') : require('../assets/images/navbar/edit.png');

    return (
        <TouchableOpacity activeOpacity={0.7} style={globalStyles.cardButton} onPress={onPress}>
            <Image style={[globalStyles.cardButtonIcon, { tintColor: type === 'DELETE' ? themeStyles.error : type === 'STATUS' && !isActive ? themeStyles.success : type === 'STATUS' && isActive ? themeStyles.error : themeStyles.text }]} source={icon} />
            {title ?
                <Text allowFontScaling={false} style={[globalStyles.cardButtonText, { color: !isActive ? themeStyles.success : themeStyles.warning }]}>{title}</Text>
                :
                <Text allowFontScaling={false} style={[globalStyles.cardButtonText, { color: type === 'DELETE' ? themeStyles.error : type === 'STATUS' && !isActive ? themeStyles.success : type === 'STATUS' && isActive ? themeStyles.error : themeStyles.text }]}>{buttonTitle}</Text>
            }
        </TouchableOpacity>
    )
}

export default CardMenuItem
