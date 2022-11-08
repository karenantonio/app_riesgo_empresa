import React, { Component } from 'react';
import { View, Alert, BackHandler, Platform, ImageBackground, StyleSheet, Image, NativeModules } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import { Label, Spinner, Footer, Grid, Row, Container, Col, Content, Text, Header } from 'native-base'
import { connect } from 'react-redux';
import VersionNumber from 'react-native-version-number'
import Login from '../components/login'
import Menu from '../components/menu'
import Search from '../components/search'
import Documents from '../components/documents'
import Toolbar from '../components/toolbar'
import Profile from '../components/profile'
import Log from '../components/log'
import Fd from '../components/fd';
import theme from './theme'
import { Auth } from 'aws-amplify';
import { getValue, setValue, deleteDocument } from '../realm/functions/common'
import { actionReadDocs, actionAddLog, actionSetLog, actionAddDoc } from '../store/actions'
import { selectorDocumento } from '../store/selectors'
import { syncUpWithOutService } from '../functions'
import { createDocFromForm, getDeviceInfo } from '../functions/common'
import { readDocuments, readMenu, readPerfil, readForms, readLists, readConsultaE, readConsultaT } from '../realm/functions/load'
import { CustomProgressBar } from '../components/CustomProgressBar'
import { actionSendDoc } from '../store/actions'
import { sendDocFromId } from '../functions/sendDoc'
import { API_VERSION } from 'react-native-dotenv'

const backGroundImage = require('./images/background_cmpc.png');
const headerImage = require('./images/cmpc-login.png');

global.swich = [];
global.nota = [];
global.porcentaje = [];

class Index extends Component {

  constructor(props) {
    super(props);
    this.setBackButton = this.setBackButton.bind(this);
  }

  state = {
    interface: "Loading",
    autenticationMode: "remote",
    username: "",
    password: "",
    cognito: null,
    dataDoc: null,
    readOnly: false,
    enviando: false,
    backButton: () => { },
    version: "",
    check: false
  }

  setBackButton(callBack) {
    this.setState({ backButton: callBack })
  }

  initApp(username, password, remember, cognito) {
    //SET LOG DE SINCRONIZACIÓN EN VACIO
    this.props.setLog([]);

    //PROCESO DE SINCRONIZACION CON CALLBACK
    this.sincronizacion(() => {

      //PASAR A MENU PRINCIPAL:
      this.setState({ interface: "Menu" });
    });

    //this.setState({interface:"Log",username,password,remember,cognito});
    this.setState({ interface: "Loading", username, password, remember, cognito });
  }

  async sincronizacion(callBack) {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        await syncUpWithOutService((a, b) => { this.props.addLog(a, b) });
        callBack();
      } else {
        //Alert.alert("Información","No hay conexión a Internet.");
        callBack();
      }
    });
  }

  componentDidMount() {
    fetch(API_VERSION)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ version: responseJson.version });
      });

    //SET BACK BOTTOM EVENT LISTENER
    if (Platform.OS === "android") {
      BackHandler.addEventListener('hardwareBackPress', () => { this.state.backButton(); return true; });
    }

    const username = getValue("username");
    const password = getValue("password");
    const remember = getValue("remember");
    const cognito = getValue("cognito");

    if (username === "") {
      this.setState({ interface: "Login", autenticationMode: "remote", username, password });
    }
    else {
      //ANALIZAR OPCION DE RECORDAR CONTRASEÑA:
      if (remember === "1") {
        this.initApp(username, password, remember, cognito);
      }
      else {
        //NECESARIO AUTENTICAR: LOCAL O REMOTAMENTE DEPENDIENDO DE LA CONEXIÓN ACTUAL. (LOCAL SOLO ULTIMO USUARIO REGISTRADO)
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            this.setState({ interface: "Login", autenticationMode: "remote", username, password });
          }
          else {
            this.setState({ interface: "Login", autenticationMode: "local", username, password });
          }
        });
      }
    }
  }

  async newFD(item) {
    const forms = await readForms();
    const perfil = await readPerfil(this.state.username);

    if (forms.filter(row => row._id.$oid == item.FormId).length > 0) {
      const form = forms.filter(row => row._id.$oid == item.FormId)[0];
      const device = this.props.device;
      const cognito = this.state.cognito;

      const doc = createDocFromForm(form, perfil, device, JSON.stringify(cognito));

      //SAVE
      await this.props.addDoc(doc);

      this.setState({ interface: "FD", dataDoc: selectorDocumento(doc), readOnly: false });
    }
    else {
      Alert.alert("Información", "El formulario '" + item.FormId + "' no se encuentra disponible.");
    }
  }

  async enviarDoc(docId, callBack) {
    const resultado = await sendDocFromId(docId);
    if (resultado === true) {
      await this.props.sendDoc(docId, { $date: new Date().getTime() }, 3, null);
      callBack();
    }
    else {
      Alert.alert("Información", "Error al enviar.");
    }
    this.setState({ enviando: false });
  }

  async eliminarDocVacio(docId) {

  }

  go(go) {
    this.setState({ interface: go })
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
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (Platform.OS === "android" && this.state.interface === "Menu") {
        BackHandler.exitApp();
      }
    });
    const Botonera = <Toolbar theme={theme} onPress={(option) => {
      switch (option) {
        case 4: this.setState({ interface: "Profile" }); break;
        case 1: this.setState({ interface: "Menu" }); break;
        case 2: this.setState({ interface: "Documents" }); break;
        case 3: this.setState({ interface: "Search" }); break;
      }
    }} interface={this.state.interface} />;

    return (
      <View style={{ flex: 1 }}>

        {this.state.interface === "Login" &&
          <Login
            Auth={Auth}
            autenticationMode={this.state.autenticationMode}
            nowUser={this.state.username}
            nowPass={this.state.password}
            backGroundImage={backGroundImage}
            headerImage={headerImage}
            onSuccess={(autenticationMode, username, password, cognito, remember) => {
              if (autenticationMode === "local") {
                setValue("remember", remember);
              }
              if (autenticationMode === "remote") {
                setValue("username", username);
                setValue("password", password);
                setValue("remember", remember);
                setValue("cognito", JSON.stringify(cognito));
              }
              this.initApp(username, password, remember, cognito);
            }}
            theme={theme}
            setBackButton={this.setBackButton}
            go={go => this.go(go)}
          />
        }

        {this.state.interface === "Menu" &&
          <Menu toolbar={Botonera} onPress={(item) => { this.newFD(item); }} dataf={readMenu} theme={theme} refresh={(callBack) => {
            this.sincronizacion(callBack);
          }}
            setBackButton={this.setBackButton}
            go={go => this.go(go)}
            profilef={readPerfil}
            username={this.state.username}
          />
        }

        {this.state.interface === "Profile" &&
          <Profile toolbar={Botonera} theme={theme} username={this.state.username} closeSession={() => {
            setValue("username", "");
            setValue("password", "");
            setValue("remember", "0");
            setValue("cognito", "");
            this.setState({ interface: "Login", autenticationMode: "remote", username: "", password: "" });
          }}
            onSuccess={(newPassword) => {
              setValue("password", newPassword);
            }}
            setBackButton={this.setBackButton}
            go={go => this.go(go)}
            profilef={readPerfil}
          />
        }

        {this.state.interface === "Loading" &&
          <Container style={{ paddingTop: '70%' }}>
            <Header transparent >
              <Image
                source={require('../components/login/imgs/riesgo_empresa.png')}
                style={{
                  width: '90%',
                  height: '90%',
                }}
              />
            </Header>
            {/* footer del spiner */}
            <Footer style={{ backgroundColor: 'transparent', height: '10%', paddingBottom: '25%', paddingTop: '40%' }} span>
              <Spinner color='green' size={50} />
            </Footer>
          </Container>}

        {this.state.interface === "Log" &&
          <Log message={this.props.log} />
        }

        {this.state.interface === "Search" &&
          <Search toolbar={Botonera} empresasf={readConsultaE} trabajadoresf={readConsultaT} setBackButton={this.setBackButton} go={go => this.go(go)} theme={theme} />
        }

        {this.state.interface === "Documents" &&
          <Documents toolbar={Botonera} theme={theme} documentosf={readDocuments}
            draftPress={(doc, readOnly) => { this.setState({ interface: "FD", dataDoc: doc, readOnly }); }}
            outboxPress={(doc, readOnly) => { this.setState({ interface: "FD", dataDoc: doc, readOnly }); }}
            sentPress={(doc, readOnly) => { this.setState({ interface: "FD", dataDoc: doc, readOnly }); }}
            draftLongPress={(docId, callBack) => {
              Alert.alert('Confirmación', '¿Seguro que desea eliminar este documento?.', [
                { text: 'Cancelar', onPress: () => { }, style: 'cancel', }, { text: 'OK', onPress: () => { deleteDocument(docId, callBack) } },], { cancelable: false },
              );
            }}
            outboxLongPress={(docId, callBack) => {
              Alert.alert('Confirmación', '¿Envío manual de este documento?.', [
                { text: 'Cancelar', onPress: () => { }, style: 'cancel', }, {
                  text: 'OK', onPress: async () => {
                    await NetInfo.fetch().then(async state => {
                      if (state.isConnected) { this.setState({ enviando: true }); this.enviarDoc(docId, callBack); } else {
                        Alert.alert("Información", "No hay conexión a Internet.");
                      }
                    });
                  }
                },], { cancelable: false },
              );
            }}
            setBackButton={this.setBackButton}
            go={go => this.go(go)}
          />
        }

        {(this.state.interface === "Documents" && this.state.enviando === true) && <CustomProgressBar />}

        {this.state.interface === "FD" &&
          <Fd
            setInterface={(a) => { this.setState({ interface: a }); }}
            doc={this.state.dataDoc}
            docReset={() => {
              const docs = readDocuments();
              const doc = docs.filter(row => row._id === this.state.dataDoc._id);
              //console.log("DOC ACTUAL",JSON.stringify(doc[0]));
              this.setState({ dataDoc: doc[0] });
            }}
            readOnly={this.state.readOnly}
            theme={theme}
            setBackButton={() => { }}
            listasf={readLists}
            setBackButton={this.setBackButton}
            go={go => this.go(go)}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer_spinner: {
    backgroundColor: 'transparent',
    marginBottom: '5%'
  },
  row_user: {
    justifyContent: 'center',
    elevation: 0,
    borderBottomWidth: 0,
    marginTop: '20%'
  },
  row_welcome: {
    justifyContent: 'center',
    elevation: 0,
    borderBottomWidth: 0,
    marginTop: '10%'
  },
  text_welcome: {
    fontSize: 23,
    color: 'white',
    fontWeight: 'bold'
  }

})


const mapStateToProps = (state) => {
  return {
    log: state.reducerLog
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchReadDocs: () => { dispatch(actionReadDocs()); },
    addLog: (log, category) => { dispatch(actionAddLog(log, category)); },
    setLog: (log) => { dispatch(actionSetLog(log)); },
    addDoc: (doc) => { dispatch(actionAddDoc(doc)); },
    sendDoc: (_docId, _fecha, _estado, _gps) => { dispatch(actionSendDoc(_docId, _fecha, _estado, _gps)); },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);