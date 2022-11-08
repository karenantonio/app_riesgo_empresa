import React, { Component } from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, Header as Cabezera, Body } from 'native-base';

class Header extends React.Component {
  render() {
    return (
      <View style={{ paddingTop: '20%' }}>
        <Cabezera transparent>
          <Image
            source={require('./imgs/riesgo_empresa.png')}
            style={styles.logo_background_sso}
            resizeMode="stretch" />
        </Cabezera>
        {/*body de el logo sso !!!intentar pasar al header*/}
        <Body>
          <Text style={{ paddingTop: '6%', color: '#32645C', fontSize: 22, fontFamily: 'Roboto', fontWeight: 'bold' }}>
            Inicia sesión para continuar
          </Text>
        </Body>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo_background_sso: {
    width: '90%',
    height: '90%',
  },
  logo_icon_sso: {
    width: 110,
    height: 110,
  },
});

export default Header;
