/* eslint-disable react-native/no-inline-styles */
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '../hooks/ThemeContext';
import { FontSize } from '../styles/FontSize';
import { CommonTheme } from '../styles/Theme';
import { responsiveWidth } from '../utils/responsiveDimension';

type ExitConfirmationProps = {
    title: string,
    subTitle: string,
    visible: boolean,
    onClose: () => void;
    confirmButtonText: string,
    onSubmit: () => void,
    confirmButtonColor?: string
}

const DialogBox = ({ title, subTitle, visible, onClose, confirmButtonText, onSubmit, confirmButtonColor }: ExitConfirmationProps) => {
    const { themeStyles, font, selectedFontSize, accentColor } = useTheme();
    const isTablet = DeviceInfo.isTablet();
    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: CommonTheme.modalOverlay,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            width: responsiveWidth(isTablet ? 45 : 80),
            backgroundColor: themeStyles.card,
            borderRadius: 25,
        },
        textContainer: {
            paddingVertical: 20,
            paddingHorizontal: 30,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        title: {
            fontFamily: font === 'Default' ? undefined : `${font} Medium`,
            fontWeight: font === 'Default' ? '500' : undefined,
            color: themeStyles.text,
            fontSize: FontSize.xLarge * selectedFontSize,
            textAlign: 'center',
        },
        subTitle: {
            fontFamily: font === 'Default' ? undefined : font,
            fontSize: FontSize.medium * selectedFontSize,
            textAlign: 'center',
            color: themeStyles.textSecondary,
        },
        buttonsContainer: {
            borderTopColor: themeStyles.border,
            borderTopWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        button: {
            paddingTop: 10,
            paddingBottom: 15,
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
        },
        buttonText: {
            fontFamily: font === 'Default' ? undefined : `${font} Medium`,
            fontWeight: font === 'Default' ? '500' : undefined,
            color: themeStyles.text,
            fontSize: FontSize.medium * selectedFontSize,
            textAlign: 'center',
        }
    })
    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType='fade'
            transparent
            presentationStyle={'overFullScreen'}
            statusBarTranslucent={true}
        >
            <Pressable onPress={onClose} style={styles.modalOverlay}>
                <Pressable onPress={() => { }} style={styles.modalContainer}>
                    <View style={styles.textContainer}>
                        <Text allowFontScaling={false} style={styles.title}>{title}</Text>
                        <Text allowFontScaling={false} style={styles.subTitle}>{subTitle}</Text>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Pressable style={[styles.button, { borderRightColor: themeStyles.border, borderRightWidth: 1 }]} onPress={onClose}>
                            <Text style={styles.buttonText} allowFontScaling={false}>Close</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={onSubmit}>
                            <Text style={[styles.buttonText, { color: confirmButtonColor || accentColor }]} allowFontScaling={false}>{confirmButtonText}</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default DialogBox
