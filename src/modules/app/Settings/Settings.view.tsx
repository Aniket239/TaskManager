/* eslint-disable react-native/no-inline-styles */
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getGlobalStyles } from '../../../styles/globalStyles'
import Navbar from '../../../components/Navbar';
import { FontSize } from '../../../styles/FontSize';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../hooks/ThemeContext';

const Settings = () => {
    const globalStyles = getGlobalStyles();
    const navigation = useNavigation<any>();
    const { themeStyles, font, selectedFontSize } = useTheme();
    const goto = (route: string, params?: any) => {
        navigation.navigate(route, params);
    }

    const styles = StyleSheet.create({
        settingsContainer: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            flex: 1
        },
        title: {
            marginBottom: 10,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontSize: FontSize.medium * selectedFontSize,
            fontWeight: '500',
            color: themeStyles.textSecondary,
        },
        card: {
            marginVertical: 20,
            paddingHorizontal: 15,
            borderRadius: 15,
            backgroundColor: themeStyles.card,
            elevation: 5,
            shadowColor: themeStyles.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3
        },
        cardItem: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingVertical: 18,
            gap: 15,
            borderBottomWidth: 1,
            borderBottomColor: themeStyles.border,
        },
        icon: {
            width: 18,
            height: 18,
            resizeMode: 'contain',
            // marginRight: responsiveHeight(1.7),
            marginLeft: 3,
            tintColor: themeStyles.text,
        },
        text: {
            fontSize: FontSize.large * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: '500',
            color: themeStyles.text,
            // flex: 1,
            // flexWrap: 'wrap'
        },
    });
    return (
        <View style={globalStyles.container}>
            <Navbar title='Settings' hideBackButton logout themeToggle />
            <View style={styles.settingsContainer}>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.cardItem} onPress={() => { goto('Profile') }}>
                        <Image style={styles.icon} source={require('../../../assets/images/auth/username.png')} />
                        <Text allowFontScaling={false} style={styles.text}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cardItem, { borderBottomWidth: 0 }]} onPress={() => { goto('Appearance') }}>
                        <Image style={styles.icon} source={require('../../../assets/images/settings/appAppearance.png')} />
                        <Text allowFontScaling={false} style={styles.text}>Appearance</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Settings
