import React, { Component } from 'react';
import {
  View,
  ScrollView,
  TouchableHighlightComponent,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Body,
  Text,
  Label,
  CheckBox,
  Spinner,
  Item,
  Input,
  Switch,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icon } from 'react-native-elements';

/*
Auth
onError
onSuccess
onRemember
autenticationMode
nowUser
nowPass
*/

class SignIn extends React.Component {
  state = {
    username: '',
    password: '',
    remember: false,
    spinner: false,
    ok: true,
    show: true,
    icon_eye: 'eye',
    message: '',
    mvisible: true
  };

  validarUsurio() {
    this.setState({ ok: true, spinner: true });
    const remember = this.state.remember === true ? '1' : '0';

    if (this.state.username === '' || this.state.password === '') {
      /* this.props.onError('Usuario o contraseña no válido.'); */
      this.setState({ message: 'Uno o más campos vacios.', ok: false, spinner: false });
      return;
    }

    if (this.props.autenticationMode === 'remote') {
      //console.log('llega remote');
      this.props.Auth.signIn(this.state.username, this.state.password)
        .then(user => {
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this.setState({ mvisible: false });
            this.props.Auth.completeNewPassword(user, this.state.password);
            this.validarUsurio()
          } else {
            this.props.onSuccess(
              this.props.autenticationMode,
              this.state.username,
              this.state.password,
              user,
              remember,
            );
          }
        })
        .then(user => {
          //SE CAMBIÓ LA CONTRASEÑA DEJANDO LA MISMA:
          this.props.onSuccess(
            this.props.autenticationMode,
            this.state.username,
            this.state.password,
            user,
            remember,
          );
        })
        .catch(err => {
          if (this.state.mvisible) {
            this.setState({ message: 'Correo o Contraseña Incorrectos.', ok: false, spinner: false, mvisible: false });
          } else {
            this.setState({ ok: true, mvisible: false });
          }
        });
    }

    if (this.props.autenticationMode === 'local') {
      //console.log('llega local');
      if (
        this.state.username === this.props.nowUser &&
        this.state.password === this.props.nowPass
      ) {
        this.props.onSuccess(
          this.props.autenticationMode,
          this.state.username,
          this.state.password,
          true,
          remember,
        );
      } else {
        this.setState({ message: 'Correo o Contraseña Incorrectos.', ok: false, spinner: false });
      }
    }
  }

  //<Icon type="FontAwesome" name="user" style={{fontSize:20,color:theme.loginIconColor}} />
  //<Icon type="FontAwesome" name="unlock-alt" style={{fontSize:20,color:theme.loginIconColor}} />
  render() {
    const theme = this.props.theme;

    return (
      <View keyboardShouldPersistTaps={'handled'}>
        {/* grid que muestra mensaje de rror de autentificacion */}
        {!this.state.ok ? (
          <Grid>
            <Row style={styles.row_alert}>
              <Text style={{ color: 'red' }}>{this.state.message}</Text>
            </Row>
            <Row style={styles.row_alert}>
              <Text style={{ color: 'red' }}>
                Por favor, vuelva a Intentarlo.
              </Text>
            </Row>
          </Grid>
        ) :
          (
            <Grid>
              <Row style={styles.row_alert}>
                <Text style={{ color: 'white' }}>{this.state.message}</Text>
              </Row>
              <Row style={styles.row_alert}>
                <Text style={{ color: 'white' }}>
                  Por favor, vuelva a Intentarlo.
                </Text>
              </Row>
            </Grid>
          )}

        <Item success fixedLabel>
          <Input
            autoCapitalize="none"
            keyboardType={'email-address'}
            onChangeText={username => {
              this.setState({ username });
            }}
            placeholder="Correo"
            value={this.state.username}
          />
        </Item>

        <Item success fixedLabel>
          <Input
            autoCapitalize="none"
            placeholder="Contraseña"
            secureTextEntry={this.state.show}
            onChangeText={password => {
              this.setState({ password });
            }}
            value={this.state.password}
          />
          <Icon
            name={this.state.icon_eye}
            type="font-awesome"
            color="#6E6664"
            onPress={() => {
              if (this.state.show) {
                //console.log('egdkjf');
                this.setState({ show: false });
                this.setState({ icon_eye: 'eye-slash' });
              } else if (!this.state.show) {
                this.setState({ show: true });
                this.setState({ icon_eye: 'eye' });
              }
            }}
          />
        </Item>

        <Item style={styles.item_reme_user}>
          <Switch
            trackColor={{ true: 'green', false: 'grey' }}
            value={this.state.remember}
            onChange={() => {
              this.setState({ remember: !this.state.remember });
            }}></Switch>
          <Text style={{ fontSize: 15 }}>Recordar Usuario y Contraseña</Text>
        </Item>

        {/* seccion grid de ingresar y modulo olvide contraseña */}
        <Grid style={{ marginTop: '6%' }}>
          <Col>
            <Grid style={{ marginBottom: '5%' }}>
              <Col style={{ marginRight: '15%' }}></Col>
              <Col style={{ justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>Ingresar</Text>
              </Col>
              <Col style={{ justifyContent: 'flex-end' }}>
                {this.state.spinner ? (
                  <Spinner color={theme.primary} />
                ) : (
                  <Button
                    block
                    rounded
                    large
                    style={styles.button_ingresar}
                    onPress={() => {
                      this.validarUsurio();
                    }}>
                    <Icon
                      name="arrow-right"
                      type="font-awesome"
                      color="#ffffff"></Icon>
                  </Button>
                )}
              </Col>
            </Grid>
            <Grid style={styles.row_alert}>
              {/* <Text
                style={{borderBottomWidth: 1, marginTop: '5%'}}
                onPress={() => {
                  this.props.onRemember();
                }}>
                Olvidé mi Contraseña
              </Text> */}
            </Grid>
          </Col>
        </Grid>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  row_alert: {
    justifyContent: 'center',
    elevation: 0,
    borderBottomWidth: 0,
  },
  item_reme_user: {
    marginTop: '9%',
    borderBottomWidth: 0,
    elevation: 0,
  },
  button_ingresar: {
    borderRadius: 60,
    width: 100,
    height: 100,
    backgroundColor: "#32645c",
  },
});

export default SignIn;
