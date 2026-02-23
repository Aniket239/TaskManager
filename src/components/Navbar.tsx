/* eslint-disable react-native/no-inline-styles */
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    Animated as RNAnimated,
    Easing,
    ViewStyle,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { useTheme } from '../hooks/ThemeContext';
import Logo from './Logo';
import LogoutModal from './LogoutModal';
import { FontSize } from '../styles/FontSize';
import { CommonTheme } from '../styles/Theme';
import { responsiveWidth, responsiveHeight } from '../utils/responsiveDimention';


type NavbarProps = {
    title: string;
    notification?: boolean;
    themeToggle?: boolean;
    goto?: string;
    onBack?: () => void;
    hamburger?: boolean;
    logout?: boolean;
    edit?: boolean;
    onEditPress?: () => void;
    menu?: boolean;
    onMenuPress?: () => void;
    search?: boolean;
    onSearch?: () => void;
    aiButton?: boolean;
    onAiButtonPress?: () => void;
    style?: ViewStyle;
    logo?: boolean;
    showLanguage?: boolean;
    hideBackButton?: boolean;
};

const Navbar = ({
    title,
    logo = false,
    notification = false,
    themeToggle = false,
    logout = false,
    edit = false,
    onEditPress,
    menu = false,
    onMenuPress,
    search = false,
    onSearch,
    style,
    hideBackButton = false
}: NavbarProps) => {
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const { theme, themeStyles, font, toggleTheme, selectedFontSize } = useTheme();
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
    const isTablet = DeviceInfo.isTablet();
    const goBack = () => {
        if (!hideBackButton) {
            navigation.goBack();
        }
    };

    // 1. Create an Animated.Value (0 = light, 1 = dark)
    const rotation = useRef(new RNAnimated.Value(theme === 'light' ? 0 : 1))
        .current;

    // 2. Interpolate to degrees
    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // 3. Handler to both toggle theme and animate
    const handleThemeToggle = () => {
        const toValue = theme === 'light' ? 1 : 0;
        RNAnimated.timing(rotation, {
            toValue,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            toggleTheme(theme === 'light' ? 'dark' : 'light');
            // swap the theme only after animation (optional)
        });
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            backgroundColor: themeStyles.navbar,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 5,
        },
        leftContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
            paddingTop: insets.top + 5,
            paddingLeft: 15,
            paddingBottom: 15,
            paddingRight: 10,
        },
        rightContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 8,
            paddingRight: 7,
        },
        icon: {
            width: 18,
            height: 18,
            resizeMode: 'contain',
            tintColor: themeStyles.text,
        },
        title: {
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
            fontSize: FontSize.navigationHeading * selectedFontSize,
            color: themeStyles.text,
            maxWidth: responsiveWidth(isTablet ? 45 : 60),
        },
        rightButton: {
            padding: 8,
        },
        themeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveWidth(1),
            borderRadius: 50,
            borderColor: themeStyles.border,
            borderWidth: 1,
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveWidth(1.2),
            marginRight: responsiveWidth(1)
        },
        themeText: {
            color: CommonTheme.white,
            fontFamily: `${font} Medium`,
            fontSize: FontSize.large * selectedFontSize,
            marginBottom: responsiveHeight(0.2),
            paddingRight: responsiveWidth(1),
        },
        // no change to themeIcon style
        themeIcon: {
            width: responsiveWidth(4),
            height: responsiveWidth(4),
            resizeMode: 'contain',
            tintColor: themeStyles.text,
        },
    });

    return (
        <>
            <Animated.View entering={SlideInUp.duration(500)}>
                <View style={styles.container}>
                    <Pressable style={[styles.leftContainer, style]} onPress={goBack} pressRetentionOffset={3000}>
                        {!hideBackButton ?
                            <Image
                                style={styles.icon}
                                source={require('../assets/images/navbar/arrow.png')}
                            />
                            :
                            null}
                        {/* } */}
                        {logo ?
                            <Logo />
                            :
                            <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>
                                {title}
                            </Text>
                        }
                    </Pressable>

                    <View style={styles.rightContainer}>
                        {themeToggle && (
                            <Pressable style={styles.themeButton} onPress={handleThemeToggle}>
                                <Text allowFontScaling={false} style={styles.themeText}>
                                    {theme}
                                </Text>
                                {/* 4. Use Animated.Image and apply the rotation */}
                                <RNAnimated.Image
                                    style={[
                                        styles.themeIcon,
                                        { transform: [{ rotate: rotateInterpolate }] },
                                    ]}
                                    source={
                                        theme === 'light'
                                            ? require('../assets/images/navbar/light.png')
                                            : require('../assets/images/navbar/dark.png')
                                    }
                                />
                            </Pressable>
                        )}
                        {notification && (
                            <Pressable style={styles.rightButton} onPress={() => { navigation.navigate('Notifications') }}>
                                <Image
                                    style={styles.icon}
                                    source={require('../assets/images/navbar/notification.png')}
                                />
                            </Pressable>
                        )}
                        {search && (
                            <Pressable style={[styles.rightButton, { paddingRight: 17 }]} onPress={onSearch}>
                                <Image
                                    style={[styles.icon]}
                                    source={require('../assets/images/navbar/search.png')}
                                />
                            </Pressable>
                        )}
                        {edit &&
                            <Pressable style={styles.rightButton} onPress={onEditPress}>
                                <Image style={styles.icon} source={require('../assets/images/navbar/edit.png')} />
                            </Pressable>
                        }
                        {menu &&
                            <Pressable style={styles.rightButton} onPress={onMenuPress}>
                                <Image style={styles.icon} source={require('../assets/images/navbar/kababMenu.png')} />
                            </Pressable>
                        }
                        {logout && (
                            <Pressable style={[styles.rightButton, { paddingRight: 17 }]} onPress={() => { setShowLogoutModal(true) }}>
                                <Image
                                    style={[styles.icon, { tintColor: themeStyles.error }]}
                                    source={require('../assets/images/navbar/logout.png')}
                                />
                            </Pressable>
                        )}
                    </View>
                </View>
            </Animated.View>
            <LogoutModal visible={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
        </>
    );
};

export default Navbar;
