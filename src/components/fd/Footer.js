import React, { Component } from 'react';
import { FooterTab, Footer as Footer2, Text, Left, Button, Right } from 'native-base';
import { connect } from 'react-redux';
import { Image, View, Alert, Modal, ActivityIndicator } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { validateDocValues, validateEmptyDoc, validatePageValues } from '../../functions/common';
import { sendDocFromId } from '../../functions/sendDoc';
import { actionAddDoc, actionSendDoc, actionUpdateDoc } from '../../store/actions';
import Geolocation from '@react-native-community/geolocation';
import { CustomProgressBar } from '../CustomProgressBar';
import { deleteEmptyDocument } from '../../realm/functions/common';
import { Icon } from 'react-native-elements';
import { readForms, readPerfil, readDocuments, readLists } from '../../realm/functions/load';
import { getValue } from '../../realm/functions/common';
import { getDeviceInfo, createDocFromForm } from '../../functions/common';
import { selectorDocumento } from '../../store/selectors';
import Fd from '../../components/fd';
import theme from '../../project/theme'

class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.setBackButton = this.setBackButton.bind(this);
  }

  state = {
    interface: "Footer",
    dataDoc: null,
    readOnly: false,
    sending: false
  }

  async guardar() {
    await this.props.updateDoc(this.props.doc._id);
    Alert.alert(
      'Guardar',
      'Los datos se han guardado correctamente.',
      [
        {
          text: 'Ok', onPress: () => {
            return;
          }
        },
      ], { cancelable: false },
    );
  }

  async guardar_salir() {
    await this.props.updateDoc(this.props.doc._id);
    Alert.alert(
      'Guardar',
      'Los datos se han guardado correctamente.',
      [
        {
          text: 'Ok', onPress: () => {
            return;
          }
        },
      ], { cancelable: false },
    );
    this.props.setInterface("Menu");
  }

  async enviar_aux(position) {
    let time = new Date().getTime();
    let conexion = await NetInfo.fetch();

    //SI HAY CONEXI??N REALIZAR ENVIO INMEDIATO:
    if (conexion.isConnected) {
      //ANTES DE ENVIAR HAY QUE HACER GUARDADO DE GPS Y VARIABLES COMUNES
      await this.props.sendDoc(this.props.doc._id, { $date: time }, 2, position);

      const resultado = await sendDocFromId(this.props.doc._id);
      if (resultado === true) {
        //ACTUALIZAR EL ESTADO
        await this.props.sendDoc(this.props.doc._id, { $date: time }, 3, position);
      }
    }
    else {
      //GUARDADO DE GPS Y VARIABLES COMUNES
      await this.props.sendDoc(this.props.doc._id, { $date: time }, 2, position);
    }
    this.setState({ sending: false });
    this.props.setInterface("Documents");
  };

  setBackButton(callBack) {
    this.setState({ backButton: callBack })
  };

  go(go) {
    this.setState({ interface: go })
  };

  async enviar() {
    //GUARDAR DATOS GENERALES
    await this.props.updateDoc(this.props.doc._id);

    //LEVANTAR LOADING:
    this.setState({ sending: true });

    const age = (1000 * 60 * 30);
    const time = (1000 * 1 * 20);

    //SOLO GPS:
    Geolocation.getCurrentPosition((position) => {
      let p = { ...position }; p.Tipo = "GPS";
      this.enviar_aux(p);
    }, (error) => {
      //SEGUNDO INTENTO POR WIFI:
      Geolocation.getCurrentPosition((position) => {
        let p = { ...position }; p.Tipo = "WIFI";
        this.enviar_aux(p);
      }, (error) => {
        this.enviar_aux(null);
      }, { enableHighAccuracy: false, timeout: time, maximumAge: age });
    }, { enableHighAccuracy: true, timeout: time, maximumAge: age });
  };

  //this.props.theme.fdFooterBackGround



  render() {
    if (this.props.focus === true) {
      return (<View></View>);
    }
    else
      return (
        this.state.interface === "Footer" ?
          <Footer2>
            {this.state.sending === true && <CustomProgressBar />}
            <FooterTab style={{ backgroundColor: this.props.doc.Tag[0].Valor }}>
              <Button vertical onPress={() => {

                const validation = validateEmptyDoc(this.props.valores, this.props.doc.Pages);
                if (this.props.readOnly === false)
                  Alert.alert('Confirmaci??n',
                    '??Guardar los cambios de este formulario?.',
                    [
                      { text: 'Cancelar', onPress: () => { }, style: 'cancel', },
                      {
                        text: 'No', onPress: () => {
                          if (validation === true) {
                            deleteEmptyDocument(this.props.doc._id);
                          }
                          this.props.setInterface("Menu");
                        }
                      },
                      {
                        text: 'Si', onPress: () => {
                          if (validation === true) {
                            Alert.alert('Formulario vac??o', 'No puede guardar un formulario vac??o');
                          } else {
                            this.guardar_salir();
                          }
                        }
                      },
                    ], { cancelable: false },
                  );
                else
                  this.props.setInterface("Documents");
              }}>
                <Icon type="material-community" active name="exit-to-app" color={"#FFFFFF"} />
                <Text style={{ color: "#FFFFFF" }}>Salir</Text>
              </Button>

              {this.props.readOnly !== true &&
                <Button vertical onPress={() => {
                  const validation = validateEmptyDoc(this.props.valores, this.props.doc.Pages);
                  if (validation) {
                    Alert.alert('Formulario vac??o', 'No puede guardar un formulario vac??o');
                  } else {
                    this.guardar();
                  }
                }}>
                  <Icon active name="save" color={"#FFFFFF"} />
                  <Text style={{ color: "#FFFFFF" }}>Guardar</Text>
                </Button>
              }
              {this.props.readOnly !== true &&
                <Button vertical onPress={async () => {
                  const validation = validateDocValues(this.props.valores, this.props.doc.Pages);
                  if (validation.valid === false /* && validation.message.length > 0 */) {
                    Alert.alert("Los siguientes campos son obligatorios", validation.message);
                    return;
                  }

                  Alert.alert('Confirmaci??n', '??Seguro que desea enviar este documento?.',
                    [
                      { text: 'Cancelar', onPress: () => { }, style: 'cancel', },
                      { text: 'OK', onPress: async () => { await this.enviar(); } },
                    ], { cancelable: false },
                  );
                  // }
                }}
                >

                  <Icon active name="send" color={"#FFFFFF"} />
                  <Text style={{ color: "#FFFFFF" }}>Enviar</Text>
                </Button>
              }
            </FooterTab>
          </Footer2 >
          :
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
            listasf={readLists}
            setBackButton={this.setBackButton}
            go={go => this.go(go)}
          />
      );
  }
}

const mapStateToProps = (state) => {
  return {
    valores: state.reducerValores, /*[{id,tipo,clave,valor}]*/
    focus: state.reducerFocus
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addDoc: (doc) => { dispatch(actionAddDoc(doc)); },
    sendDoc: (_docId, _fecha, _estado, _gps) => { dispatch(actionSendDoc(_docId, _fecha, _estado, _gps)); },
    updateDoc: (docId) => { dispatch(actionUpdateDoc(docId)); },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);