import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '../hooks/ThemeContext';

const CardMenuButton = () => {
    const { themeStyles } = useTheme();
    const styles = StyleSheet.create({
        container: {
            width: 35,
            // height: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // borderWidth: 1,
            // borderColor: themeStyles.border,
            // borderRadius: 100,
            marginRight: -10,
            // backgroundColor: 'blue'
        },
        icon: {
            width: 18,
            height: 18,
            resizeMode: 'contain',
            tintColor: themeStyles.placeholder,
        }
    })
    return (
        <View style={styles.container}>
            <Image style={styles.icon} source={require('../assets/images/navbar/kababMenu.png')} />
        </View>
    )
}

export default CardMenuButton
