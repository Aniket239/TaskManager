/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
    ViewStyle,
    Keyboard,
} from 'react-native';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import dayjs, { Dayjs } from 'dayjs';

import ReanimatedAnimated, { SlideInDown } from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from '../hooks/ThemeContext';
import { getGlobalStyles } from '../styles/globalStyles';
import { FontSize } from '../styles/FontSize';
import { CommonTheme, DarkTheme } from '../styles/Theme';
import { responsiveHeight, responsiveWidth } from '../utils/responsiveDimension';

// assets
const calendarIcon = require('../assets/images/common/calendar.png');

type SingleValue = DateType | null | undefined;
type RangeValue = { startDate?: DateType; endDate?: DateType };
type MultipleValue = DateType[];

type DateInputFieldProps = {
    label: string;
    mode?: 'single' | 'range' | 'multiple';
    /** For `single`, pass a DateType. For `range`, pass { startDate, endDate }. For `multiple`, pass DateType[] */
    value: SingleValue | RangeValue | MultipleValue;
    /** onChange returns: Dayjs | {startDate?: Dayjs; endDate?: Dayjs} | Dayjs[] | null depending on mode */
    onChange: (next: Dayjs | { startDate?: Dayjs; endDate?: Dayjs } | Dayjs[] | null) => void;

    minDate?: DateType;
    maxDate?: DateType;

    required?: boolean;
    readOnly?: boolean;
    error?: boolean;
    errorMessage?: string;
    theming?: boolean;
    displayFormat?: string; // for displaying in the "input"
    placeholder?: string;
    onFocus?: () => void;
    icon?: any;

    // optional time controls supported by the lib
    timePicker?: boolean;
    use12Hours?: boolean;
    initialView?: 'day' | 'month' | 'year' | 'time';
};

const DateInputField = ({
    label,
    mode = 'single',
    value,
    onChange,

    minDate,
    maxDate,

    required = false,
    readOnly = false,
    error,
    errorMessage,
    theming = true,
    displayFormat = 'DD MMM YYYY',
    placeholder = '',
    onFocus = () => { },
    icon,

    timePicker = false,
    use12Hours = false,
    initialView = 'day',
}: DateInputFieldProps) => {
    const lastTapRef = useRef<{ date?: string; time?: number }>({});

    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);

    const { themeStyles, font, selectedFontSize, accentColor } = useTheme();
    const isTablet = DeviceInfo.isTablet();
    const hasValue =
        (mode === 'single' && !!value) ||
        (mode === 'range' && (value as RangeValue)?.startDate) ||
        (mode === 'multiple' && Array.isArray(value) && (value as MultipleValue).length > 0);

    const animatedIsFocused = useRef(new Animated.Value(hasValue ? 1 : 0)).current;
    const globalStyles = getGlobalStyles();
    useEffect(() => {
        Keyboard.dismiss();
        Animated.timing(animatedIsFocused, {
            toValue: hasValue || focused ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [focused, hasValue]);

    const toPickerDate = (d: any): Date | undefined => {
        if (!d) return undefined;
        // dayjs handles Date/string/number/Dayjs; invalid -> isValid() false
        const dj = dayjs(d);
        return dj.isValid() ? dj.toDate() : undefined;
    };

    const labelStyle = useMemo(
        () =>
        ({
            position: 'absolute',
            left: 8,
            top: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [17.5, // blurred position
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
            borderRadius: 50,
        } as ViewStyle),
        [animatedIsFocused, selectedFontSize, theming, themeStyles, font, required]
    );

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theming ? themeStyles.background : 'black',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginTop: 18,
            paddingRight: 8,
            // paddingVertical: 8,
            borderRadius: 10,
            borderColor: error
                ? themeStyles.error
                : focused
                    ? accentColor
                    : theming
                        ? themeStyles.border
                        : DarkTheme.border,
            borderWidth: 1,
            marginHorizontal: 'auto',
            paddingLeft: 3,
        },
        leftIcon: {
            width: 15,
            height: 15,
            tintColor: themeStyles.placeholder,
            resizeMode: 'contain',
        },
        inputContainer: {
            width: '100%',
            flex: 1,
        },
        labelContainer: { width: '75%' },
        readOnly: {
            color: themeStyles.placeholder,
            fontSize: FontSize.text * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
        required: {
            color: accentColor,
            fontSize: FontSize.inputFields * selectedFontSize,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
        displayTextRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 17,
        },
        displayText: {
            marginTop: responsiveHeight(0.1),
            fontSize: FontSize.inputFields * selectedFontSize,
            paddingLeft: 5,
            marginLeft: 8,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
            color: (hasValue && !readOnly) ? themeStyles.text : themeStyles.textSecondary,
            flex: 1,
        },
        calendarIconBtn: { padding: 7, marginTop: 0 },
        rightIcon: {
            width: 12,
            height: 12,
            tintColor: themeStyles.placeholder,
            resizeMode: 'contain',
        },
        modalBackdrop: {
            flex: 1,
            backgroundColor: CommonTheme.modalOverlay,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        modalSheet: {
            width: isTablet ? responsiveWidth(50) : responsiveWidth(100),
            backgroundColor: theming ? themeStyles.card : DarkTheme.card,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderBottomLeftRadius: isTablet ? 25 : 0,
            borderBottomRightRadius: isTablet ? 25 : 0,
            paddingHorizontal: 20,
            paddingTop: 20,
            // paddingBottom: Platform.OS === 'ios' ? responsiveHeight(3) : responsiveHeight(2),
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        modalTitle: {
            fontSize: FontSize.large * selectedFontSize,
            color: themeStyles.text,
            fontFamily: font !== 'Default' ? `${font} SemiBold` : '',
            fontWeight: font !== 'Default' ? undefined : '600',
            paddingHorizontal: 10,
        },
        modalAction: { paddingVertical: 10, paddingHorizontal: 10 },
        modalActionText: {
            fontSize: FontSize.inputFields * selectedFontSize,
            color: accentColor,
            fontFamily: font !== 'Default' ? `${font} Medium` : '',
            fontWeight: font !== 'Default' ? undefined : '500',
        },
    });

    const formatOne = (d?: DateType) => {
        if (!d) return '';
        const format = timePicker
            ? (use12Hours ? 'DD MMM YYYY, hh:mm A' : 'DD MMM YYYY, HH:mm')
            : displayFormat;

        return dayjs(d).format(format);
    };
    const formatted = useMemo(() => {
        if (mode === 'single') return (value ? formatOne(value as SingleValue) : '') || placeholder;

        if (mode === 'range') {
            const { startDate, endDate } = (value as RangeValue) || {};
            if (!startDate && !endDate) return placeholder;
            if (startDate && endDate) return `${formatOne(startDate)} – ${formatOne(endDate)}`;
            return startDate ? `${formatOne(startDate)} – …` : `… – ${formatOne(endDate)}`;
        }

        // multiple
        const arr = (Array.isArray(value) ? (value as MultipleValue) : []) || [];
        if (!arr.length) return placeholder;
        const first3 = arr.slice(0, 3).map(formatOne).filter(Boolean);
        const rest = arr.length - first3.length;
        return rest > 0 ? `${first3.join(', ')} +${rest} more` : first3.join(', ');
    }, [value, mode, displayFormat, placeholder]);

    const openPicker = () => {
        setFocused(true);
        onFocus?.();
        setOpen(true);
    };
    const closePicker = () => {
        setOpen(false);
        setFocused(false);
    };

    // default styles from lib → override a few tokens with your theme
    const defaultCalendarStyles = useDefaultStyles();
    const calendarStyles = {
        ...defaultCalendarStyles,
        // Today cell
        time_selector: {
            ...defaultCalendarStyles.time_selector,
            // width: responsiveWidth(100),
        },
        today: {
            ...defaultCalendarStyles.today,
            borderColor: accentColor,
            borderWidth: 1,
            backgroundColor: themeStyles.card,
            borderRadius: 10
        },
        today_label: {
            ...defaultCalendarStyles.today_label,
            color: themeStyles.text
        },
        // Selected day cell
        selected: {
            ...defaultCalendarStyles.selected,
            backgroundColor: accentColor,
            borderRadius: 10
        },
        selected_label: {
            ...defaultCalendarStyles.selected_label,
            color: 'white',
        },

        // Days / months / years text color
        days: { ...defaultCalendarStyles.days, color: themeStyles.text },
        month: { ...defaultCalendarStyles.month, color: themeStyles.text, borderColor: themeStyles.border },
        year: { ...defaultCalendarStyles.year, color: themeStyles.text, borderColor: themeStyles.border },

        // Labels
        day_label: { ...defaultCalendarStyles.day_label, color: themeStyles.text },
        month_label: { ...defaultCalendarStyles.month_label, color: themeStyles.text },
        year_label: { ...defaultCalendarStyles.year_label, color: themeStyles.text },

        // 🔹 Header month & year at the top of the calendar
        month_selector_label: {
            ...defaultCalendarStyles.month_selector_label,
            color: themeStyles.text
        },

        year_selector_label: {
            ...defaultCalendarStyles.year_selector_label,
            color: themeStyles.text
        },

        // Arrows
        button_prev_image: {
            ...defaultCalendarStyles.button_prev_image,
            tintColor: accentColor,
            color: accentColor,
        },
        button_next_image: {
            ...defaultCalendarStyles.button_next_image,
            tintColor: accentColor,
            color: accentColor,
        },

        selected_month: {
            ...defaultCalendarStyles.selected_month,
            backgroundColor: themeStyles.card,
            borderColor: accentColor,
        },
        // Selected month & year labels
        selected_month_label: {
            ...defaultCalendarStyles.selected_month_label,
            color: accentColor,
        },
        selected_year: {
            ...defaultCalendarStyles.selected_year,
            backgroundColor: themeStyles.card,
            borderColor: accentColor,
        },
        // Selected year & year labels
        selected_year_label: {
            ...defaultCalendarStyles.selected_year_label,
            color: accentColor,
        },
    };

    return (
        <>
            <View style={styles.container}>
                {icon &&
                    <Image style={styles.leftIcon} source={icon} />
                }
                <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={openPicker} disabled={readOnly}>
                    <View style={styles.labelContainer}>
                        <Animated.Text style={labelStyle} allowFontScaling={false}>
                            {label}
                            {readOnly && <Text allowFontScaling={false} style={styles.readOnly}> (Read Only)</Text>}
                            {required && <Text allowFontScaling={false} style={styles.required}> *</Text>}
                        </Animated.Text>
                    </View>

                    <View style={styles.displayTextRow}>
                        <Text allowFontScaling={false} numberOfLines={1} style={styles.displayText}>
                            {formatted}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.calendarIconBtn} onPress={openPicker}>
                    <Image style={styles.rightIcon} source={calendarIcon} />
                </TouchableOpacity>
            </View>

            {!!errorMessage && (
                <Text style={globalStyles.error} allowFontScaling={false}>
                    {errorMessage}
                </Text>
            )}

            {/* Calendar Modal */}
            <Modal visible={open} transparent animationType="fade" onRequestClose={closePicker} statusBarTranslucent presentationStyle='overFullScreen'>
                <View style={styles.modalBackdrop}>
                    <ReanimatedAnimated.View style={{ flex: 1, justifyContent: isTablet ? 'center' : 'flex-end' }} entering={SlideInDown.duration(800)}>
                        <View style={styles.modalSheet}>
                            <View style={styles.modalHeader}>
                                <Text allowFontScaling={false} style={styles.modalTitle}>
                                    {label}
                                </Text>
                                <TouchableOpacity style={styles.modalAction} onPress={closePicker}>
                                    <Text allowFontScaling={false} style={styles.modalActionText}>Done</Text>
                                </TouchableOpacity>
                            </View>

                            {/* IMPORTANT: DateTimePicker expects different props per mode */}
                            <DateTimePicker
                                mode={mode}
                                // single
                                date={
                                    mode === 'single'
                                        ? toPickerDate(value as SingleValue) ?? new Date()
                                        : undefined
                                }

                                // range
                                startDate={
                                    mode === 'range'
                                        ? toPickerDate((value as RangeValue)?.startDate)
                                        : undefined
                                }
                                endDate={
                                    mode === 'range'
                                        ? toPickerDate((value as RangeValue)?.endDate)
                                        : undefined
                                }
                                // multiple
                                dates={
                                    mode === 'multiple'
                                        ? ((Array.isArray(value) ? value : []) as any[])
                                            .map(toPickerDate)
                                            .filter(Boolean) as Date[]
                                        : undefined
                                }
                                // change handler normalized to Dayjs shapes
                                onChange={(params: any) => {
                                    if (mode === 'single') {
                                        const d: DateType | null = params?.date ?? null;
                                        if (!d) {
                                            onChange(null);
                                            return;
                                        }

                                        const selected = dayjs(d);
                                        const now = Date.now();

                                        const lastDate = lastTapRef.current.date;
                                        const lastTime = lastTapRef.current.time ?? 0;

                                        // 🔹 Double tap detection (same date within 400ms)
                                        if (
                                            lastDate === selected.format('YYYY-MM-DD') &&
                                            now - lastTime < 400
                                        ) {
                                            onChange(selected);
                                            closePicker(); // ✅ CLOSE MODAL
                                        } else {
                                            onChange(selected);
                                            lastTapRef.current = {
                                                date: selected.format('YYYY-MM-DD'),
                                                time: now,
                                            };
                                        }
                                    }
                                    else if (mode === 'range') {
                                        const start = params?.startDate ? dayjs(params.startDate) : undefined;
                                        const end = params?.endDate ? dayjs(params.endDate) : undefined;
                                        onChange({ startDate: start, endDate: end });
                                    }
                                    else {
                                        const ds: DateType[] = params?.dates ?? [];
                                        onChange(ds.map((x) => dayjs(x)));
                                    }
                                }}

                                minDate={toPickerDate(minDate)}
                                maxDate={toPickerDate(maxDate)}
                                timePicker={timePicker}
                                use12Hours={use12Hours}
                                initialView={initialView}
                                styles={calendarStyles}
                            />
                        </View>
                    </ReanimatedAnimated.View>
                </View>
            </Modal>
        </>
    );
};

export default DateInputField;
