/* eslint-disable react-hooks/rules-of-hooks */
import { StyleSheet, Platform } from "react-native";
import { CommonTheme, DarkTheme, LightTheme } from "./Theme";
import { FontSize } from "./FontSize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/ThemeContext";
import { responsiveHeight } from "../utils/responsiveDimension";

export const getGlobalStyles = (
) => {
    const themeStyles = useTheme().theme === "dark" ? DarkTheme : LightTheme;
    return StyleSheet.create({
        logo: {
            fontWeight: 'bold',
            fontSize: FontSize.largeHeading,
            color: themeStyles.text,
        },
        heading: {
            fontWeight: 'bold',
            fontSize: FontSize.largeHeading,
            color: themeStyles.text,
        },
        subHeading: {
            fontWeight: '500',
            fontSize: FontSize.largeSubHeading,
            color: themeStyles.textSecondary,
        },
        tabletContainer: {
            flex: 1,
            backgroundColor: themeStyles.background,
            paddingBottom: useSafeAreaInsets().bottom - (Platform.OS === 'ios' ? responsiveHeight(1) : 0),
            width: '70%',
            marginHorizontal: 'auto',
            paddingVertical: 20,
        },
        container: {
            flex: 1,
            backgroundColor: themeStyles.background,
        },
        listContainer: {
            // paddingBottom: 30,
            padding: 15,
            paddingBottom: useSafeAreaInsets().bottom + (Platform.OS === 'ios' ? 10 : 50),
            gap: 15
        },
        noDataContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            width: '100%',
        },
        noDataText: {
            fontSize: FontSize.medium,
            fontWeight: "500",
            color: themeStyles.textSecondary,
            textAlign: "center",
        },
        cardContainer: {
            padding: 15,
            borderRadius: 15,
            elevation: 3,
            backgroundColor: themeStyles.card,
            shadowColor: themeStyles.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            gap: 10,
            // borderWidth: 1,
            // borderColor: themeStyles.border,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            flex: 1,
            gap: 5,
        },
        column: {
            gap: 5,
        },
        cardHeading: {
            fontSize: FontSize.largeSubHeading,
            fontWeight: 'bold',
            color: themeStyles.text,
        },
        cardIcon: {
            width: 13,
            height: 13,
            resizeMode: 'contain',
            tintColor: themeStyles.textSecondary,
            marginTop: 3,
        },
        cardLabel: {
            // fontWeight: '500',
            fontSize: FontSize.medium,
            color: themeStyles.textSecondary,
        },
        cardValue: {
            fontWeight: '500',
            fontSize: FontSize.large,
            color: themeStyles.text,
        },
        cardButton: {
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
            padding: 5,
            gap: 15,
        },
        cardButtonIcon: {
            width: 15,
            height: 15,
            resizeMode: 'contain',
            tintColor: themeStyles.text,
        },
        cardButtonText: {
            fontWeight: '500',
            fontSize: FontSize.medium,
            color: themeStyles.text,
            alignSelf: 'flex-start',
        },
        link: {
            fontWeight: '500',
            fontSize: FontSize.medium,
            color: CommonTheme.primary,
            // textDecorationLine: 'underline',
            borderBottomWidth: 1,
            borderColor: CommonTheme.primary,
            borderStyle: 'dashed',
            alignSelf: 'flex-start',
        },
        formContentContainer: {
            // marginHorizontal: 'auto',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: useSafeAreaInsets().bottom - (Platform.OS === 'ios' ? responsiveHeight(2) : 0) + responsiveHeight(1),
        },
        formContainer: {
            maxWidth: 600,
            // backgroundColor: themeStyles.card,
        },
        detailsHeading: {
            fontWeight: 'bold',
            fontSize: FontSize.smallHeading,
            color: themeStyles.text,
        },
        detailsLabel: {
            fontWeight: '500',
            fontSize: FontSize.medium,
            color: themeStyles.textSecondary,
        },
        detailsValue: {
            fontWeight: '500',
            fontSize: FontSize.large,
            color: themeStyles.text,
        },
        error: {
            fontSize: FontSize.medium,
            color: themeStyles.error,
            left: 3,
            marginTop: 5,
            marginBottom: -5,
            width: '87%',
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: CommonTheme.modalOverlay,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            backgroundColor: themeStyles.card,
            padding: 18,
        },
    });
};
