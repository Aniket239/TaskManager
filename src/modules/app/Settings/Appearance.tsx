import { View } from 'react-native'
import React from 'react'
import Navbar from '../../../components/Navbar';
import { getGlobalStyles } from '../../../styles/globalStyles';
import ThemeSettings from '../../../components/ThemeSettings';


const Appearance = () => {
    const globalStyles = getGlobalStyles();
    return (
        <View style={globalStyles.container}>
            <Navbar title={'Appearance'} />
            <View style={globalStyles.listContainer}>
                <ThemeSettings />
            </View>
        </View>

    )
}

export default Appearance
