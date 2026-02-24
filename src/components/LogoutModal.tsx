/* eslint-disable react-native/no-inline-styles */
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useTheme } from '../hooks/ThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';
import { AppDispatch } from '../redux/store';
import { logoutUser } from '../redux/slices/authSlice';

interface LogoutModalType {
    visible: boolean;
    onClose: () => void;
}
const LogoutModal = ({ visible, onClose }: LogoutModalType) => {
    const { themeStyles, font } = useTheme();
    const globalStyles = getGlobalStyles()
    const dispatch = useDispatch<AppDispatch>()
    const styles = StyleSheet.create({
        modalContainer: {
            width: 300,
            borderRadius: 25,
            padding: 0,
        },
        heading: {
            fontFamily: font === 'Default' ? undefined : `${font} Bold`,
            fontWeight: font === 'Default' ? '700' : undefined,
            paddingVertical: 16,
            paddingTop: 20,
            borderBottomWidth: 1,
            borderBottomColor: themeStyles.borderSecondary,
            textAlign: 'center',
        },
        optionButton: {
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: themeStyles.borderSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            transparent
            animationType="fade"
            statusBarTranslucent
            presentationStyle='overFullScreen'
        >
            <Pressable style={globalStyles.modalOverlay} onPress={onClose}>
                <Pressable style={[globalStyles.modalContainer, styles.modalContainer]}>
                    <Text allowFontScaling={false} style={[globalStyles.detailsHeading, styles.heading]}>Are you sure?</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); dispatch(logoutUser()) }}>
                        <Text allowFontScaling={false} style={[globalStyles.detailsValue, { color: themeStyles.textSecondary }]}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionButton, { borderBottomWidth: 0 }]} onPress={onClose}>
                        <Text allowFontScaling={false} style={[globalStyles.detailsValue, { color: themeStyles.success }]}>Cancel</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>

        </Modal>
    )
}

export default LogoutModal
