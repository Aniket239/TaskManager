import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Navbar from '../../../components/Navbar';
import { getGlobalStyles } from '../../../styles/globalStyles';
import { RootState } from '../../../redux/store';
import { useTheme } from '../../../hooks/ThemeContext';
import { FontSize } from '../../../styles/FontSize';
import CustomButton from '../../../components/CustomButton';

const Profile = () => {
    const globalStyles = getGlobalStyles();
    const navigation = useNavigation<any>();
    const { themeStyles, font, selectedFontSize } = useTheme();
    const userEmail = useSelector((state: RootState) => state.auth.user?.email);

    const goToResetPassword = () => {
        navigation.navigate('ForgotPassword', {
            from: 'profile',
            email: userEmail ?? '',
        });
    };

    const styles = StyleSheet.create({
        container: {
            padding: 15,
        },
        card: {
            backgroundColor: themeStyles.card,
            borderRadius: 15,
            padding: 15,
            gap: 8,
            elevation: 3,
            shadowColor: themeStyles.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        label: {
            color: themeStyles.textSecondary,
            fontSize: FontSize.medium * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
        value: {
            color: themeStyles.text,
            fontSize: FontSize.largeSubHeading * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
    });

    return (
        <View style={globalStyles.container}>
            <Navbar title="Profile" logout />
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text allowFontScaling={false} style={styles.label}>Email</Text>
                    <Text allowFontScaling={false} style={styles.value}>{userEmail || 'Not available'}</Text>
                    <CustomButton
                        title="Reset Password"
                        onPress={goToResetPassword}
                        disabled={!userEmail}
                    />
                </View>
            </View>
        </View>
    );
};

export default Profile;
