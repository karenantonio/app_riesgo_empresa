import React from 'react';
import { View } from 'native-base';
import { StyleSheet, Image } from 'react-native';
import VersionNumber from 'react-native-version-number'

class Footer extends React.Component {
    render() {
        return (
            <View>
                <Image
                    source={require('./imgs/footer_cmpc.png')}
                    style={styles.logo_footer_cmpc}
                    resizeMode="stretch"></Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        height: 80
    },
    logo_footer_cmpc: {
        width: 150,
        height: 70
    }
})

export default Footer;