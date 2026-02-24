/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View, StyleSheet, Image, Animated, TouchableOpacity, ViewStyle, Text, ImageProps } from 'react-native';
import { FontSize } from '../styles/FontSize';
import { getGlobalStyles } from '../styles/globalStyles';
import { useTheme } from '../hooks/ThemeContext';
import PasswordStrength, { PasswordStrengthType } from './PasswordStrength';
import { checkPasswordStrength } from '../utils/checkPasswordStrength';

interface InputFieldPropTypes {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    icon?: ImageProps;
    onFocus?: () => void;
    onBlur?: () => void;
    theming?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'decimal-pad';
    error?: boolean;
    errorMessage?: string;
    maxLength?: number,
    required?: boolean,
    readOnly?: boolean,
    type?: 'none' | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url" | 'pincode',
    showPasswordStrength?: boolean,
    textarea?: boolean,
    initialHeight?: number,
    maxHeight?: number,
    onPasswordStrengthChange?: (passwordStrength: PasswordStrengthType) => void,
}

const InputField = ({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    icon,
    onFocus,
    onBlur,
    theming = true,
    keyboardType = 'default',
    error,
    errorMessage,
    maxLength,
    required = false,
    readOnly,
    type = 'text',
    showPasswordStrength = false,
    textarea = false,
    initialHeight = 100,
    maxHeight = 300,
    onPasswordStrengthChange,
}: InputFieldPropTypes) => {
    const [textAreaHeight, setTextAreaHeight] = useState(initialHeight);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthType>();
    const { themeStyles, font, selectedFontSize, accentColor } = useTheme();
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const animatedIsFocused = useRef(new Animated.Value(value !== '' ? 1 : 0)).current;
    const globalStyles = getGlobalStyles();
    const iconMap: { [key: string]: any } = {
        show: require('../assets/images/auth/show.png'),
        hide: require('../assets/images/auth/hide.png'),
    };

    useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: value !== '' || focused ? 1 : 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [focused, value, textarea]);

    const handleContentSizeChange = (event: any) => {
        if (!textarea) return;

        const newHeight = Math.min(
            Math.max(initialHeight, event.nativeEvent.contentSize.height),
            maxHeight
        );

        setTextAreaHeight(newHeight);
    };

    const labelStyle = {
        position: 'absolute',
        left: 2.5, // fixed left position for non-countryCode input

        top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [
                15, // blurred position
                -10,  // focused (above input)
            ],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [
                FontSize.placeholderBlurred * selectedFontSize,
                FontSize.placeholderFocused * selectedFontSize,
            ],
        }),
        paddingHorizontal: 5,
        backgroundColor: theming ? themeStyles.background : 'black',
        color: themeStyles.placeholder,
        fontFamily: font !== 'Default' ? `${font} Medium` : '',
        fontWeight: font !== 'Default' ? undefined : '500',
        borderRadius: 5,
    } as ViewStyle;

    const handleFocus = () => { setFocused(true); onFocus && onFocus() };
    const handleBlur = () => { setFocused(false); onBlur && onBlur() };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theming ? themeStyles.background : 'black',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            marginTop: 18,
            paddingHorizontal: 10,
            paddingRight: secureTextEntry ? 0 : undefined,
            borderRadius: 8,
            borderColor: error ? themeStyles.error : focused
                ? accentColor
                : themeStyles.border,
            borderWidth: 1,
            marginHorizontal: 'auto',
        },
        inputContainer: {
            flex: 1,
            // maxWidth: secureTextEntry ? '85%' : '100%',
        },
        labelContainer: {
            // width: '75%',
            // marginVertical: responsiveHeight(2),
        },
        required: {
            color: accentColor,
            fontSize: FontSize.inputFields * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
        icon: {
            width: 15,
            height: 15,
            objectFit: 'contain',
            tintColor: themeStyles.placeholder,
        },
        countryCode: {
            color: readOnly ? themeStyles.placeholder : themeStyles.textSecondary,
            fontSize: FontSize.inputFields * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
            // marginVertical: 3,
            marginLeft: 10,
            // marginTop: responsiveHeight(0.2),
            // backgroundColor: 'blue'
        },
        readOnly: {
            color: themeStyles.placeholder,
            fontSize: FontSize.text * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
        input: {
            // marginTop: responsiveHeight(0.1),
            // flex: 1,
            fontSize: FontSize.inputFields * selectedFontSize,
            paddingLeft: 0,
            marginLeft: 8,
            paddingVertical: 15,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
            color: readOnly ? themeStyles.textSecondary : themeStyles.text,
            // width: secureTextEntry ? '90%' : countryCode ? '90%' : '95%',
            flex: 1,
        },
        passwordShowHideButton: {
            padding: 14,
        },
    });

    return (
        <>
            <View style={styles.container}>
                {(icon) && <Image style={styles.icon} source={icon} />}
                <View style={styles.inputContainer}>
                    <View style={styles.labelContainer}>
                        <Animated.Text style={labelStyle} allowFontScaling={false}>{label}{readOnly && <Text allowFontScaling={false} style={styles.readOnly}> {`(Read Only)`}</Text>}{required && <Text allowFontScaling={false} style={styles.required}> *</Text>}</Animated.Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            value={value}
                            onChangeText={(text) => {
                                onChangeText(text);
                                if (showPasswordStrength) {
                                    const strength = checkPasswordStrength(text);
                                    setPasswordStrength(strength);
                                    onPasswordStrengthChange && onPasswordStrengthChange(strength);
                                }
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            secureTextEntry={!showPassword && secureTextEntry}
                            multiline={textarea}
                            scrollEnabled={textarea && textAreaHeight >= maxHeight}
                            numberOfLines={textarea ? 4 : 1}
                            textAlignVertical={textarea ? 'top' : 'center'}
                            onContentSizeChange={handleContentSizeChange}
                            style={[
                                styles.input,
                                textarea && {
                                    height: textAreaHeight,
                                    paddingTop: 12,
                                    paddingBottom: 12,
                                },
                            ]}
                            keyboardType={keyboardType}
                            allowFontScaling={false}
                            maxLength={maxLength}
                            readOnly={readOnly}
                            inputMode={(type !== 'text' && type !== 'pincode') ? type : undefined}
                        />
                    </View>
                </View>
                {secureTextEntry &&
                    <TouchableOpacity style={styles.passwordShowHideButton} onPress={() => setShowPassword(!showPassword)}>
                        {
                            showPassword ?
                                <Image style={styles.icon} source={iconMap['show']} />
                                :
                                <Image style={styles.icon} source={iconMap['hide']} />
                        }
                    </TouchableOpacity>
                }
            </View>
            {errorMessage && <Text style={globalStyles.error} allowFontScaling={false}>{errorMessage}</Text>}
            {showPasswordStrength && passwordStrength &&
                <PasswordStrength passwordStrengthValues={passwordStrength} />
            }
        </>
    );
};
export default InputField;
