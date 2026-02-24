/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/ThemeContext';
import { FontSize } from '../styles/FontSize';
import { accentColors, DarkTheme, LightTheme } from '../styles/Theme';
const ThemeSettings = () => {
    const { theme, toggleTheme, themeSelected, accentColor, toggleAccentColor, font, selectedFontSize } = useTheme();
    const themeStyles = theme === 'dark' ? DarkTheme : LightTheme;
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const index = accentColors.findIndex(
            item => item.hex === accentColor
        );

        if (index !== -1) {
            // Small timeout ensures FlatList has rendered
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5, // centers the item
                });
            }, 100);
        }
    }, []);

    const handleThemeChange = (selectedTheme: "light" | "dark" | "system") => {
        // if (selectedTheme !== theme) {
        toggleTheme(selectedTheme);
        // }
    };
    const selectAccentColor = (selectedAccentColor: string) => {
        toggleAccentColor(selectedAccentColor);
    };

    // const accentColors = [
    //     { name: "Blue", hex: "#007BFF" },
    //     { name: "Green", hex: "#00C853" },
    //     { name: "Orange", hex: "#FF7043" },
    //     { name: "Purple", hex: "#7E57C2" },
    //     { name: "Yellow", hex: "#FFB300" },
    //     { name: "Red", hex: "#D32F2F" },
    //     { name: "Teal", hex: "#00897B" },
    //     { name: "Pink", hex: "#EC407A" },
    //     { name: "Indigo", hex: "#3F51B5" },
    //     { name: "Lime", hex: "#C0CA33" }
    // ];



    const styles = StyleSheet.create({
        container: {
            // flex: 1,
            paddingVertical: 15,
            borderRadius: 15,
            paddingHorizontal: 15,
            backgroundColor: themeStyles.card
        },
        title: {
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontSize: FontSize.large * selectedFontSize,
            fontWeight: font !== 'Default' ? undefined : '500',
            color: themeStyles.text,
        },
        subTitle: {
            fontFamily: `${font}`,
            fontSize: FontSize.medium * selectedFontSize,
            color: themeStyles.text,
            marginBottom: 10,
        },
        modeCardContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            marginBottom: 10,
            paddingBottom: 10,
            borderBottomColor: themeStyles.border,
        },
        modeCard: {
            width: '25%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modeImage: {
            width: 55,
            height: 107,
            borderRadius: 15,
            resizeMode: 'contain',
            borderStyle: 'dotted',
            borderWidth: 1,
            objectFit: 'cover',
        },
        modeText: {
            marginTop: 10,
            textAlign: 'center',
            fontSize: FontSize.small * selectedFontSize
        },
        accentColorContainers: {
            // flexDirection: 'row',
            // justifyContent: 'center',
            // alignItems: 'center',
            // marginBottom: 10,
            marginHorizontal: 'auto',
        },
        accentColorAndTextContainer: {
            // justifyContent: 'flex-start',
            alignItems: 'center',
        },
        accentColorContainer: {
            width: 40,
            height: 40,
            borderRadius: 500,
            marginHorizontal: 7,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        accentColor: {
            width: 30,
            height: 30,
            borderRadius: 500,
        },
    })
    return (
        <>
            <Text allowFontScaling={false}
                style={styles.title}>THEME</Text>
            <View style={[styles.container]}>
                {/* Theme Selection Cards */}
                <Text allowFontScaling={false}
                    style={[styles.subTitle]}>Mode</Text>
                <View style={styles.modeCardContainer}>
                    <Pressable style={styles.modeCard} onPress={() => { handleThemeChange('light') }}>
                        <Image style={[styles.modeImage, themeSelected === 'light' ? { borderColor: accentColor, borderWidth: 2 } : { borderColor: LightTheme.border }]} source={require('../assets/images/appAppearance/light.png')} />
                        <Text allowFontScaling={false}
                            style={[styles.modeText, theme === 'light' ? { color: LightTheme.text } : { color: DarkTheme.text }, themeSelected === 'light' && { color: accentColor, fontFamily: `${font} Medium` }]}>Light</Text>
                    </Pressable>
                    <Pressable style={styles.modeCard} onPress={() => { handleThemeChange('dark') }}>
                        <Image style={[styles.modeImage, themeSelected === 'dark' ? { borderColor: accentColor, borderWidth: 2 } : { borderColor: DarkTheme.border }]} source={require('../assets/images/appAppearance/dark.png')} />
                        <Text allowFontScaling={false}
                            style={[styles.modeText, theme === 'light' ? { color: LightTheme.text } : { color: DarkTheme.text }, themeSelected === 'dark' && { color: accentColor, fontFamily: `${font} Medium` }]}>Dark</Text>
                    </Pressable>
                    <Pressable style={styles.modeCard} onPress={() => { handleThemeChange('system') }}>
                        <Image style={[styles.modeImage, theme === 'dark' ? { borderColor: LightTheme.border } : { borderColor: DarkTheme.border }, themeSelected === 'system' && { borderColor: accentColor, borderWidth: 2 }]} source={require('../assets/images/appAppearance/systemTheme.png')} />
                        <Text allowFontScaling={false}
                            style={[styles.modeText, {}, theme === 'light' ? { color: LightTheme.text } : { color: DarkTheme.text }, themeSelected === 'system' && { color: accentColor, fontFamily: `${font} Medium` }]}>System</Text>
                    </Pressable>
                </View>
                <Text allowFontScaling={false}
                    style={styles.subTitle}>Accent Color</Text>
                <FlatList
                    ref={flatListRef}
                    data={accentColors}
                    // numColumns={6}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.hex}
                    renderItem={({ item }) => (
                        <View style={styles.accentColorAndTextContainer}>
                            <View style={[styles.accentColorContainer, accentColor === item.hex && { borderWidth: 1.5, borderColor: accentColor, borderRadius: 500 }]}>
                                <TouchableOpacity style={[styles.accentColor, { backgroundColor: item.hex },]} onPress={() => selectAccentColor(item.hex)}></TouchableOpacity>
                            </View>
                            {accentColor === item.hex &&
                                <Text allowFontScaling={false}
                                    style={[{ fontSize: FontSize.small * selectedFontSize, fontFamily: `${font}` }, theme === 'light' ? { color: LightTheme.text } : { color: DarkTheme.text }]}>{item.name}</Text>
                            }
                        </View>
                    )}
                    contentContainerStyle={styles.accentColorContainers}
                    horizontal
                />
            </View>
        </>
    )
}

export default ThemeSettings;