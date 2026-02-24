/* eslint-disable react-native/no-inline-styles */
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getGlobalStyles } from '../../../styles/globalStyles';
import Navbar from '../../../components/Navbar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '../../../hooks/ThemeContext';
import { responsiveHeight } from '../../../utils/responsiveDimension';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import useSignUpViewModal from './SignUp.viewModal';
import { PasswordStrengthType } from '../../../components/PasswordStrength';

const SignUp = ({ route }: any) => {
    const { email } = route.params
    const globalStyles = getGlobalStyles();
    const { isDark } = useTheme();
    const isTablet = DeviceInfo.isTablet();
    const { formData, handleChange, errors, onSubmit, submitting, login } = useSignUpViewModal(email);

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
            <Navbar title='Sign Up' hideBackButton />
            <KeyboardAwareScrollView contentContainerStyle={globalStyles.formContentContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={[globalStyles.container, styles.container]}>
                    <Image style={styles.banner} source={isDark ? require('../../../assets/images/login/login_banner_dark.png') : require('../../../assets/images/login/login_banner.png')} />
                    <View style={[globalStyles.column, { marginBottom: 10 }]}>
                        <Text allowFontScaling={false} style={globalStyles.heading}>Sign Up</Text>
                        <Text allowFontScaling={false} style={globalStyles.subHeading}>to access Task Manager</Text>
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
                        showPasswordStrength
                        secureTextEntry={true}
                        onPasswordStrengthChange={(passwordStrength: PasswordStrengthType) => handleChange('passwordStrength', passwordStrength)}
                    />
                    <InputField
                        label={'Confirm Password'}
                        value={formData.confirmPassword}
                        onChangeText={(text) => handleChange('confirmPassword', text)}
                        error={!!errors.confirmPassword}
                        errorMessage={errors.confirmPassword}
                        maxLength={250}
                        secureTextEntry={true}
                    />
                    <CustomButton title={'Sign Up'} onPress={onSubmit} loading={submitting} disabled={submitting} />
                    <TouchableOpacity activeOpacity={0.7} style={[globalStyles.row, { justifyContent: 'center', paddingVertical: 5 }]} onPress={login}>
                        <Text allowFontScaling={false} style={globalStyles.detailsLabel}>Already have an account?</Text>
                        <Text allowFontScaling={false} style={globalStyles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default SignUp
