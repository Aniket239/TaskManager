/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/ThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';
import { FontSize } from '../styles/FontSize';
import Tooltip from './Tooltip';

export interface PasswordStrengthType {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    score: number; // out of 10
    strength: 'Weak' | 'Fair' | 'Good' | 'Strong';
}
const PasswordStrength = ({
    passwordStrengthValues,
}: {
    passwordStrengthValues: PasswordStrengthType;
}) => {
    const globalStyles = getGlobalStyles();
    const [showTooltip, setShowTooltip] = useState(false);
    const { themeStyles, font, selectedFontSize, accentColor } = useTheme();

    const progressAnim = useRef(new Animated.Value(0)).current;

    const progressPercentage = (passwordStrengthValues.score / 10) * 100;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progressPercentage,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [progressPercentage]);
    if (!passwordStrengthValues) return null;

    const getStrengthColor = () => {
        switch (passwordStrengthValues.strength) {
            case 'Weak':
                return themeStyles.error;
            case 'Fair':
                return themeStyles.warning ?? '#FFA500';
            case 'Good':
                return themeStyles.success;
            case 'Strong':
                return accentColor;
            default:
                return themeStyles.border;
        }
    };

    const styles = StyleSheet.create({
        progressContainer: {
            height: 8,
            width: '100%',
            backgroundColor: themeStyles.border,
            borderRadius: 6,
            overflow: 'hidden',
            marginVertical: 6,
        },
        progressBar: {
            height: '100%',
            borderRadius: 6,
            backgroundColor: getStrengthColor(),
        },
        strengthRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
        },
        strengthText: {
            fontFamily: font !== 'Default' ? `${font} Medium` : undefined,
            fontSize: FontSize.small * selectedFontSize,
            color: getStrengthColor(),
        },
        tooltipContainer: {
            position: 'absolute',
            top: 25,
            left: 0,
            width: 240,
            backgroundColor: themeStyles.background,
            borderRadius: 8,
            padding: 10,
            borderWidth: 1,
            borderColor: themeStyles.border,
            zIndex: 10,
            elevation: 5,
            gap: 5
        },
        tooltipText: {
            fontFamily: font !== 'Default' ? `${font} Medium` : undefined,
            fontSize: FontSize.small * selectedFontSize,
            color: themeStyles.text,
        },
        infoButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        infoButtonIcon: {
            width: 14,
            height: 14,
            tintColor: themeStyles.textSecondary,
        },
    });

    return (
        <View style={{ marginTop: 8, paddingLeft: 3 }}>

            {/* Progress Bar */}
            {passwordStrengthValues?.score > 0 && (
                <>
                    {/* Strength Text */}
                    <View style={styles.strengthRow}>
                        <View style={styles.infoButton}>
                            <Text style={styles.strengthText}>
                                {passwordStrengthValues.strength}
                            </Text>
                            <Tooltip
                                visible={showTooltip}
                                onOpen={() => setShowTooltip(true)}
                                onClose={() => setShowTooltip(false)}
                                content={
                                    <View style={globalStyles.column}>
                                        <Text allowFontScaling={false} style={globalStyles.detailsLabel}>Password must contain:</Text>
                                        <Text allowFontScaling={false} style={[globalStyles.detailsLabel, { color: passwordStrengthValues?.minLength ? themeStyles.success : themeStyles.textSecondary }]}>• At least 8 characters</Text>
                                        <Text allowFontScaling={false} style={[globalStyles.detailsLabel, { color: passwordStrengthValues?.hasSpecialChar ? themeStyles.success : themeStyles.textSecondary }]}>• 1 special character</Text>
                                        <Text allowFontScaling={false} style={[globalStyles.detailsLabel, { color: (passwordStrengthValues?.hasLowerCase && passwordStrengthValues?.hasUpperCase) ? themeStyles.success : themeStyles.textSecondary }]}>• Upper & lower case</Text>
                                        <Text allowFontScaling={false} style={[globalStyles.detailsLabel, { color: passwordStrengthValues?.hasNumber ? themeStyles.success : themeStyles.textSecondary }]}>• 1 number</Text>
                                    </View>
                                }
                            >
                                <Image
                                    style={styles.infoButtonIcon}
                                    source={require('../assets/images/common/info.png')}
                                />
                            </Tooltip>
                        </View>
                    </View>
                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                </>
            )}

        </View>
    );
};

export default PasswordStrength;
