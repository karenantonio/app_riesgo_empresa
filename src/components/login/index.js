import React, { Component, version } from 'react';
import { Keyboard, StyleSheet, Alert } from 'react-native';
import { Footer as FooterNB, Container, Content, Form } from 'native-base';
import { Grid } from 'react-native-easy-grid';
import { Text, View } from 'native-base';
import VersionNumber from 'react-native-version-number'
import { API_VERSION } from 'react-native-dotenv'

import Header from './Header';
import SignIn from './SignIn';
import Footer from './Footer';
import SendRecover from './SendRecover';
import Recover from './Recover';

class index extends React.Component {
  state = {
    interface: 'SignIn',
    error: '',
    usernameForRecover: '',
    emailSentCode: '',
    hidden_footer: true,
    version: "",
    check: false
  };

  UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    fetch(API_VERSION)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ version: responseJson.version });
      });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({
      hidden_footer: false,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      hidden_footer: true,
    });
  };

  onError(error) {
    this.setState({ error });
  }

  componentDidMount() {
    this.props.setBackButton(() => { });
  }

  checkVersion(verCodigo, verApi) {
    if (verApi > verCodigo) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (this.state.version !== "") {
      if (this.checkVersion(VersionNumber.appVersion, this.state.version) && !this.state.check) {
        Alert.alert('¡ATENCIÓN!', 'Existe una nueva versión disponible para actualizar en la Play Store.');
        this.setState({ check: true });
      }
    }
    return (
      <Container style={{ marginTop: '-4%' }}>
        {/*contenido de la pagina*/}
        <Content padder>
          {/* header que renderiza la parte superior de la pagina*/}
          <Header />

          {/* form que carga el contenido de pagina*/}
          <Form style={styles.form}>
            {/* if que pregunta por la plantilla Sign In */}
            {this.state.interface == 'SignIn' && (
              <SignIn
                theme={this.props.theme}
                Auth={this.props.Auth}
                onError={err => this.onError(err)}
                onSuccess={(
                  autenticationMode,
                  username,
                  password,
                  user,
                  remember,
                ) => {
                  this.props.onSuccess(
                    autenticationMode,
                    username,
                    password,
                    user,
                    remember,
                  );
                }}
                onRemember={() => {
                  this.setState({ interface: 'SendRecover' });
                }}
                autenticationMode={this.props.autenticationMode}
                nowUser={this.props.nowUser}
                nowPass={this.props.nowPass}>
              </SignIn>

            )}
            {this.state.interface == 'SignIn' && (
              <View>
                <Grid style={styles.grid_back}>
                  <Text
                    style={{ borderBottomWidth: 1, marginTop: '5%', marginLeft: '25%' }}
                    onPress={() => {
                      this.setState({ interface: 'SendRecover' });
                    }}>
                    Recuperar contraseña
                  </Text>
                </Grid>
                <View style={{ alignContent: 'center' }}>
                  <Text style={{ marginTop: '10%', fontSize: 12, textAlign: 'center' }}>
                    {'VERSIÓN ' + VersionNumber.appVersion}
                  </Text>
                </View>
              </View>
            )}
            {/* if que pregunta por la plantilla Send Recover */}
            {this.state.interface == 'SendRecover' && (
              <SendRecover
                theme={this.props.theme}
                onSuccess={(username, email) => {
                  this.setState({
                    interface: 'Recover',
                    usernameForRecover: username,
                    emailSentCode: email,
                  });
                }}
                onBack={() => {
                  this.setState({ interface: 'SignIn' });
                }}
                onError={err => this.onError(err)}
                Auth={this.props.Auth}></SendRecover>
            )}
            {/* if que pregunta por la plantilla Recover */}
            {this.state.interface == 'Recover' && (
              <Recover
                theme={this.props.theme}
                onSuccess={() => {
                  this.setState({ interface: 'SignIn' });
                }}
                onError={err => this.onError(err)}
                onBack={() => {
                  this.setState({ interface: 'SignIn' });
                }}
                email={this.state.emailSentCode}
                username={this.state.usernameForRecover}
                Auth={this.props.Auth}></Recover>
            )}
          </Form>
        </Content>
        {/* footer que renderiza la parte inferior con logo cmpc */}
        {/* {this.state.hidden_footer && (
          <FooterNB style={styles.footer} span>
            <Footer />
          </FooterNB>
        )} */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    // marginLeft: '5%',
    marginRight: '5%',
    // marginTop: '3%',
  },
  footer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: '11%',
  }
});

/*
{this.state.subInterface === "Enviar" && <Enviar {...this.props} volver={()=>{this.volver();}} goToChange={(email)=>{this.goToChange(email);}}/>}
{this.state.subInterface === "Home" && <Home {...this.props}/>}
{this.state.subInterface === "Recuperar" && <Recuperar volver={()=>{this.volver();}} email={this.state.email} username={this.state.username} {...this.props} />}
*/

export default index;
