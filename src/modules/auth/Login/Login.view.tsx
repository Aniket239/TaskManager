/* eslint-disable react-native/no-inline-styles */
import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getGlobalStyles } from '../../../styles/globalStyles';
import Navbar from '../../../components/Navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '../../../hooks/ThemeContext';
import { responsiveHeight } from '../../../utils/responsiveDimention';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import useLoginViewModal from './Login.viewModal';

const Login = () => {
    const globalStyles = getGlobalStyles();
    const { isDark } = useTheme();
    const isTablet = DeviceInfo.isTablet();
    const { formData, handleChange, errors, onSubmit, loading } = useLoginViewModal();

    const styles = StyleSheet.create({
        container: {
            padding: 0,
        },
        banner: {
            width: isTablet ? '80%' : '90%',
            height: responsiveHeight(32),
            objectFit: 'contain',
            marginHorizontal: 'auto',
            marginTop: isTablet ? responsiveHeight(10) : 0
        },
        formContainer: {
            marginHorizontal: 'auto',
        }
    })

    return (
        <View style={globalStyles.container}>
            <Navbar title='Login' hideBackButton />
            <KeyboardAwareScrollView contentContainerStyle={globalStyles.formContentContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={[globalStyles.container, styles.container]}>
                    <Image style={styles.banner} source={isDark ? require('../../../assets/images/login/login_banner_dark.png') : require('../../../assets/images/login/login_banner.png')} />
                    <View style={[globalStyles.column, { marginBottom: 10 }]}>
                        <Text allowFontScaling={false} style={globalStyles.heading}>Login</Text>
                        <Text allowFontScaling={false} style={globalStyles.subHeading}>to access TaskManager</Text>
                    </View>
                    <InputField
                        label={'Email'}
                        value={formData.email}
                        onChangeText={(text) => handleChange('email', text)}
                        error={!!errors.email}
                        errorMessage={errors.email}
                        maxLength={250}
                        keyboardType={'email-address'}
                    />
                    <InputField
                        label={'Password'}
                        value={formData.password}
                        onChangeText={(text) => handleChange('password', text)}
                        error={!!errors.password}
                        errorMessage={errors.password}
                        maxLength={250}
                        keyboardType={'default'}
                        secureTextEntry={true}
                    />
                    <CustomButton title={'Login'} onPress={onSubmit} loading={loading} disabled={loading} />
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default Login
