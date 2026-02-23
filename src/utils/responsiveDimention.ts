import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const responsiveWidth = (percent: number) => width * (percent / 100);
export const responsiveHeight = (percent: number) => height * (percent / 100);