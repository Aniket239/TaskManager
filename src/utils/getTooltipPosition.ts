import { Dimensions, LayoutRectangle } from 'react-native';
import { TooltipPlacement } from '../components/Tooltip';

export const getTooltipPosition = (
    layout: LayoutRectangle,
    placement: TooltipPlacement,
    tooltipWidth: number,
    offset: number,
) => {
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    const clamp = (value: number, min: number, max: number) => {
        return Math.max(min, Math.min(value, max));
    };
    const centerX = layout.x + layout.width / 2;
    const centerY = layout.y + layout.height / 2;

    const padding = 8;

    const clampLeft = (left: number) =>
        clamp(left, padding, SCREEN_WIDTH - tooltipWidth - padding);

    switch (placement) {
        case 'top': {
            const left = centerX - tooltipWidth / 2;
            return {
                top: layout.y - offset,
                left: clampLeft(left),
                transform: [{ translateY: -1 }],
            };
        }

        case 'top-right': {
            const left = layout.x;
            return {
                top: layout.y - offset,
                left: clampLeft(left),
                transform: [{ translateY: -1 }],
            };
        }

        case 'top-left': {
            const left = layout.x + layout.width - tooltipWidth;
            return {
                top: layout.y - offset,
                left: clampLeft(left),
                transform: [{ translateY: -1 }],
            };
        }

        case 'bottom': {
            const left = centerX - tooltipWidth / 2;
            return {
                top: layout.y + layout.height + offset,
                left: clampLeft(left),
            };
        }

        case 'bottom-right': {
            const left = layout.x;
            return {
                top: layout.y + layout.height + offset,
                left: clampLeft(left),
            };
        }

        case 'bottom-left': {
            const left = layout.x + layout.width - tooltipWidth;
            return {
                top: layout.y + layout.height + offset,
                left: clampLeft(left),
            };
        }

        case 'left':
            return {
                top: centerY,
                left: clamp(layout.x - tooltipWidth - offset, padding, SCREEN_WIDTH),
                transform: [{ translateY: -layout.height / 2 }],
            };

        case 'right':
            return {
                top: centerY,
                left: clamp(layout.x + layout.width + offset, padding, SCREEN_WIDTH),
                transform: [{ translateY: -layout.height / 2 }],
            };

        default:
            return {};
    }
};

