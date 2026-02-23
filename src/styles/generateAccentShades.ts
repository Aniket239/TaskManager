import { TinyColor } from '@ctrl/tinycolor';
const generateShades = (hexColor: string) => {
    const baseColor = new TinyColor(hexColor);

    return {
        light1: baseColor.lighten(10).toHexString(),
        light2: baseColor.lighten(20).toHexString(),
        light3: baseColor.lighten(30).toHexString(),
        light4: baseColor.lighten(35).toHexString(),
        light5: baseColor.lighten(40).toHexString(),
        light6: baseColor.lighten(45).toHexString(),
        dark1: baseColor.darken(10).toHexString(),
        dark2: baseColor.darken(20).toHexString(),
        dark3: baseColor.darken(30).toHexString(),
        dark4: baseColor.darken(35).toHexString(),
        dark5: baseColor.darken(40).toHexString(),
        dark6: baseColor.darken(45).toHexString(),
        dark7: baseColor.darken(50).toHexString(),
    };
};

// if(useTheme().theme === 'dark') {
//         return {
//             shade1: baseColor.darken(10).toHexString(),
//             shade2: baseColor.darken(20).toHexString(),
//             shade3: baseColor.darken(30).toHexString(),
//             shade4: baseColor.darken(35).toHexString(),
//             shade5: baseColor.darken(40).toHexString(),
//             shade6: baseColor.darken(45).toHexString(),
//         };
//     }
//     else{
//         return {
//             shade1: baseColor.lighten(10).toHexString(),
//             shade2: baseColor.lighten(20).toHexString(),
//             shade3: baseColor.lighten(30).toHexString(),
//             shade4: baseColor.lighten(35).toHexString(),
//             shade5: baseColor.lighten(40).toHexString(),
//             shade6: baseColor.lighten(45).toHexString(),
//         };
//     }

export default generateShades;
