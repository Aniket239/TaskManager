import React, { useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Pressable,
    LayoutRectangle,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { getTooltipPosition } from '../utils/getTooltipPosition';

type TooltipProps = {
    visible: boolean;
    onOpen: () => void;
    onClose: () => void;
    children: React.ReactNode;
    content: React.ReactNode;
    maxWidth?: number; // 👈 rename for clarity
    offset?: number;
    placement?: TooltipPlacement;
};

export type TooltipPlacement =
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'right';

const Tooltip = ({
    visible,
    onOpen,
    onClose,
    children,
    content,
    maxWidth,
    offset = 8,
    placement = 'bottom',
}: TooltipProps) => {
    const { themeStyles, isDark } = useTheme();
    const triggerRef = useRef<View>(null);

    const [layout, setLayout] = useState<LayoutRectangle | null>(null);
    const [tooltipWidth, setTooltipWidth] = useState<number | null>(null);

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const computedMaxWidth = maxWidth ?? SCREEN_WIDTH * 0.8;

    const measure = () => {
        triggerRef.current?.measureInWindow((x, y, w, h) => {
            setLayout({ x, y, width: w, height: h });
        });
    };

    const styles = StyleSheet.create({
        tooltip: {
            position: 'absolute',
            padding: 12,
            borderRadius: 15,
            borderTopRightRadius: placement === 'bottom-left' ? 0 : 15,
            borderTopLeftRadius: placement === 'bottom-right' ? 0 : 15,
            borderBottomRightRadius: placement === 'top-left' ? 0 : 15,
            borderBottomLeftRadius: placement === 'top-right' ? 0 : 15,
            borderWidth: isDark ? 1 : 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            backgroundColor: themeStyles.card,
            borderColor: themeStyles.border
        },
    });
    return (
        <>
            <TouchableOpacity activeOpacity={0.7}
                ref={triggerRef}
                onPress={() => {
                    measure();
                    onOpen();
                }}
            >
                {children}
            </TouchableOpacity>

            <Modal visible={visible && !!layout} transparent animationType="fade" onRequestClose={onClose}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                {layout && (
                    <View
                        onLayout={(e) => {
                            setTooltipWidth(e.nativeEvent.layout.width);
                        }}
                        style={[
                            styles.tooltip,
                            {
                                maxWidth: computedMaxWidth, // ✅ key line
                            },
                            tooltipWidth
                                ? getTooltipPosition(layout, placement, tooltipWidth, offset)
                                : null,
                        ]}
                    >
                        {content}
                    </View>

                )}
            </Modal>
        </>
    );
};


export default Tooltip;
