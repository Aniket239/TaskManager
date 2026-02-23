/* eslint-disable react-hooks/rules-of-hooks */
import { StyleSheet, Platform } from "react-native";
import { CommonTheme, DarkTheme, LightTheme } from "./Theme";
import { FontSize } from "./FontSize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/ThemeContext";
import DeviceInfo from "react-native-device-info";
import { responsiveHeight } from "../utils/responsiveDimention";

export const getGlobalStyles = (
) => {
    const themeStyles = useTheme().theme === "dark" ? DarkTheme : LightTheme;
    const fontStyle = useTheme().font;
    const fontScale = useTheme().selectedFontSize;
    return StyleSheet.create({
        logo: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Bold` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : 'bold',
            fontSize: FontSize.largeHeading * fontScale,
            color: themeStyles.text,
        },
        heading: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Bold` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : 'bold',
            fontSize: FontSize.largeHeading * fontScale,
            color: themeStyles.text,
        },
        subHeading: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.largeSubHeading * fontScale,
            color: themeStyles.textSecondary,
        },
        otherLoginButtonsContainer: {
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            marginTop: 10,
        },
        otherLoginButton: {
            width: '100%',
            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: themeStyles.border,
            // paddingVertical: responsiveHeight(1),
            borderRadius: 12,
            flexDirection: 'row',
            gap: 10,
        },
        otherLoginIcon: {
            width: 22,
            height: 22,
            objectFit: 'contain',
        },
        otherLoginText: {
            // height: responsiveWidth(6.5),
            color: themeStyles.text,
            fontSize: FontSize.button * fontScale,
            fontFamily: fontStyle,
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
            fontSize: FontSize.medium * fontScale,
            fontFamily: fontStyle === "Default" ? undefined : `${fontStyle} Medium`,
            fontWeight: fontStyle === "Default" ? "500" : undefined,
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
        cardImageContainer: {
            width: 50,
            height: 50,
            borderRadius: 100,
            overflow: 'hidden',
            marginRight: 10,
            backgroundColor: themeStyles.borderSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardImage: {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },
        cardAvatarText: {
            color: themeStyles.text,
            fontSize: FontSize.xLarge * fontScale,
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Bold` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : 'bold',
            textTransform: 'uppercase',
            paddingRight: 1,
            letterSpacing: -2
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: themeStyles.border
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
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontSize: FontSize.largeSubHeading * fontScale,
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
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
            fontFamily: fontStyle !== 'Default' ? `${fontStyle}` : '',
            // fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.medium * fontScale,
            color: themeStyles.textSecondary,
        },
        cardValue: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.large * fontScale,
            color: themeStyles.text,
        },
        cardButtonIconsContainer: {
            gap: 15,
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
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.medium * fontScale,
            color: themeStyles.text,
            alignSelf: 'flex-start',
        },
        link: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.medium * fontScale,
            color: CommonTheme.primary,
            // textDecorationLine: 'underline',
            // borderBottomWidth: 1,
            borderColor: CommonTheme.primary,
            borderStyle: 'dashed',
            alignSelf: 'flex-start',
        },
        statusContainer: {
            paddingHorizontal: 6,
            paddingVertical: 3,
            justifyContent: 'center',
            alignItems: 'center',
            // alignSelf: 'flex-start',
            backgroundColor: themeStyles.borderSecondary,
            borderRadius: 5,
            // borderWidth: 0.3,
            // borderColor: themeStyles.border,
        },
        status: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Bold` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '700',
            fontSize: FontSize.small * fontScale,
            color: themeStyles.textSecondary,
            textTransform: 'capitalize',
            paddingRight: 1,
        },
        detailsImageContainer: {
            width: 120,
            height: 120,
            borderRadius: 10,
            backgroundColor: themeStyles.background,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: themeStyles.border,
        },
        detailsImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        detailsNumberOfImages: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.small * fontScale,
            color: themeStyles.textSecondary,
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 3,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderTopLeftRadius: 5,
            backgroundColor: themeStyles.card,
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
        formFieldsContainer: {
            flexDirection: DeviceInfo.isTablet() ? 'row' : 'column',
            justifyContent: 'space-between',
        },
        formField: {
            width: DeviceInfo.isTablet() ? '49.5%' : '100%',
        },
        formHeaderContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 18,
        },
        formHeaderIcon: {
            width: 12,
            height: 12,
            tintColor: themeStyles.textSecondary,
            resizeMode: 'contain',
        },
        detailsScrollContainer: {
            gap: 10,
            padding: 15,
        },
        detailsContainer: {
            backgroundColor: themeStyles.card,
            padding: 15,
            gap: 10,
            borderRadius: 15,
        },
        detailsLargeHeading: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.smallHeading * fontScale,
            color: themeStyles.text,
        },
        detailsHeading: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Bold` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : 'bold',
            fontSize: FontSize.smallHeading * fontScale,
            color: themeStyles.text,
        },
        detailsLabel: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.medium * fontScale,
            color: themeStyles.textSecondary,
        },
        detailsValue: {
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.large * fontScale,
            color: themeStyles.text,
        },
        sectionTitle: {
            textTransform: 'capitalize',
        },
        listContent: {
            gap: 12,
        },
        infoCard: {
            backgroundColor: themeStyles.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: themeStyles.borderSecondary,
            overflow: 'hidden',
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 14,
            gap: 12,
        },
        infoRowDivider: {
            borderBottomWidth: 1,
            borderColor: themeStyles.borderSecondary,
        },
        infoIconWrap: {
            width: 38,
            height: 38,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        infoIcon: {
            width: 18,
            height: 18,
            resizeMode: 'contain',
        },
        infoContent: {
            flex: 1,
            gap: 2,
        },
        infoActionIcon: {
            width: 16,
            height: 16,
            tintColor: themeStyles.textSecondary,
            resizeMode: 'contain',
        },
        actionButton: {
            padding: 7,
        },
        menuContainer: {
            backgroundColor: themeStyles.card,
            elevation: 5,
            shadowColor: themeStyles.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            marginTop: responsiveHeight(1),
            marginRight: responsiveHeight(1),
            alignSelf: 'flex-end',
            paddingVertical: 5,
        },
        menuButton: {
            paddingVertical: 13,
            paddingHorizontal: 25,
        },
        menuButtonText: {
            fontSize: FontSize.button * fontScale,
            fontFamily: fontStyle !== 'Default' ? fontStyle : '',
            color: themeStyles.text,
        },
        buttonContainer: {
            backgroundColor: themeStyles.background,
            paddingHorizontal: 15,
            paddingBottom: useSafeAreaInsets().bottom - (Platform.OS === 'ios' ? responsiveHeight(1) : 0)
        },
        textEditorContainer: {
            borderWidth: 1,
            borderColor: themeStyles.border,
            borderRadius: 10,
            marginTop: 25,
            backgroundColor: themeStyles.inputBackground,
            overflow: 'hidden',
        },
        textEditor: {
            flex: 1,
            borderRadius: 10,
            fontFamily: fontStyle !== 'Default' ? `${fontStyle} Medium` : '',
            fontWeight: fontStyle !== 'Default' ? undefined : '500',
            fontSize: FontSize.medium * fontScale,
            color: themeStyles.text,
            backgroundColor: themeStyles.inputBackground,
        },
        error: {
            fontSize: FontSize.medium * fontScale,
            color: themeStyles.error,
            fontFamily: fontStyle,
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
        dotSeparator: {
            width: 5,
            height: 5,
            borderRadius: 50,
            backgroundColor: themeStyles.text
        },
        dropdownArrow: {
            width: 10,
            height: 10,
            tintColor: themeStyles.placeholder,
            resizeMode: 'contain',
        },
        dropdownArrowActive: {
            width: 10,
            height: 10,
            tintColor: themeStyles.placeholder,
            resizeMode: 'contain',
            transform: [{ rotate: '180deg' }]
        }
    });
};
