import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  Button,
  Text,
  Item,
  Content,
  View
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import { Icon } from 'react-native-elements';  
import VersionNumber from 'react-native-version-number'


class Profile extends React.Component {
  state = {};

  render() {
    const theme = this.props.theme;
    return (
      /* background imagen */
      <ImageBackground
        source={require('./imgs/profile_header.png')}
        style={{
          flex: 1,
          width: '100%',
          height: '55%',
          justifyContent: 'center',
        }}
        resizeMode="stretch">
        {/* grid que enbloba logo user mas el nombre de usuario y su rut */}
        <Grid style={{width: '100%', height: '100%'}}>
          <Row style={styles.row_logo_user}>
            {/*imagen del logo de user */}
            <Image
              source={require('./imgs/user_gris.png')}
              style={{width: '37%', height: '154%'}}
              resizeMode="contain"></Image>
          </Row>

          <Col style={styles.col_data_user}>
            <Text style={styles.text_data_user}>{this.props.name}</Text>
            <Text style={styles.text_data_user}>{this.props.username}</Text>
          </Col>
        </Grid>
        {/* content que tiene el connido de cambio pass y foto perfil y boton log out */}
        <Content style={{marginTop: '35%'}} padder>
          <Grid>
            <Col size={1}></Col>
            <Col size={4} style={{justifyContent: 'center'}}>
              <Item style={styles.item_chan_password}>
                {/* <Icon name="key" type="font-awesome" color={theme.primary} />
                <Text>Cambiar mi Contraseña</Text> */}
              </Item>

              <Item style={styles.item_chan_photo}>
                {/* habilitar cambia foto perfil */}
               {/*  <Icon name="user" type="font-awesome" color={theme.primary} />
                <Text> Cambiar mi foto de Perfil</Text> */}
              </Item>

              <Button
                block
                style={styles.button_log_out}
                onPress={() => {
                  Alert.alert(
                    'Confirmación',
                    '¿Seguro que desea cerrar sesión?. Para volver a iniciar sesión debe tener conectividad a Internet.',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          this.props.closeSession();
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }}>
                <Text style={{fontSize: 20}}>Cerrar Sesión</Text>
              </Button>
            </Col>           
            <Col size={1}></Col>
          </Grid>
          <View style={{justifyContent: 'center', marginTop:'5%'}}>
            <Text style={{fontSize: 15, textAlign:'center'}}>{'VERSIÓN '+VersionNumber.appVersion}</Text>
          </View>
        </Content>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  row_logo_user: {
    justifyContent: 'center',
    elevation: 0,
    borderBottomWidth: 0,
    marginTop: '5%',
  },
  col_data_user: {
    alignItems: 'center',
    marginTop: '20%',
  },
  text_data_user: {
    fontSize: 20,
  },
  button_log_out: {
    backgroundColor: "#32645c",
    width: '100%',
    height: '37%',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  item_chan_password: {
    borderBottomWidth: 0,
  },
  item_chan_photo: {
    marginBottom: '30%',
    borderBottomWidth: 0,
  },
});

export default Profile;
