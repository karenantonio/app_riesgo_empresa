import React, { Component } from 'react';
import { FooterTab, Footer as Footer2, Text, Left, Button, Right } from 'native-base';
import { connect } from 'react-redux';
import { Image, View, Alert, Modal, ActivityIndicator } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { validateDocValues, validateEmptyDoc, validatePageValues } from '../../functions/common'
import { sendDocFromId } from '../../functions/sendDoc'
import { actionSendDoc, actionUpdateDoc } from '../../store/actions'
import Geolocation from '@react-native-community/geolocation';
import { CustomProgressBar } from '../CustomProgressBar'
import { deleteEmptyDocument } from '../../realm/functions/common'
import { Icon } from 'react-native-elements';

class Footer extends React.Component {

  state = {
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

    //SI HAY CONEXIÓN REALIZAR ENVIO INMEDIATO:
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
  }

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
  }

  //this.props.theme.fdFooterBackGround

  render() {
    if (this.props.focus === true) {
      return (<View></View>);
    }
    else
      return (
        <Footer2>
          {this.state.sending === true && <CustomProgressBar />}
          <FooterTab style={{ backgroundColor: this.props.doc.Tag[0].Valor }}>
            <Button vertical onPress={() => {
              const validation = validateEmptyDoc(this.props.valores, this.props.doc.Pages);
              if (this.props.readOnly === false)
                Alert.alert('Confirmación',
                  '¿Guardar los cambios de este formulario?.',
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
                          Alert.alert('Formulario vacío', 'No puede guardar un formulario vacío');
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
              <Icon type="font-awesome" active name="close" style={{ color: "#FFFFFF" }} />
              <Text style={{ color: "#FFFFFF" }}>Salir</Text>
            </Button>

            {this.props.readOnly !== true &&
              <Button vertical onPress={() => {
                const validation = validateEmptyDoc(this.props.valores, this.props.doc.Pages);
                if (validation === true) {
                  Alert.alert('Formulario vacío', 'No puede guardar un formulario vacío');
                } else {
                  this.guardar();
                }
              }}>
                <Icon active name="save" style={{ color: "#FFFFFF" }} />
                <Text style={{ color: "#FFFFFF" }}>Guardar</Text>
              </Button>
            }
            {this.props.readOnly !== true &&
              <Button vertical onPress={async () => {

                //VALIDACIONES
                const validation = validateDocValues(this.props.valores, this.props.doc.Pages);
                if (validation.valid === false) {
                  Alert.alert("Los siguientes campos son obligatorios", validation.message);
                  return;
                }

                Alert.alert('Confirmación', '¿Seguro que desea enviar este documento?.',
                  [
                    { text: 'Cancelar', onPress: () => { }, style: 'cancel', },
                    { text: 'OK', onPress: async () => { await this.enviar(); } },
                  ], { cancelable: false },
                );
              }}>
                <Icon active name="send" style={{ color: "#FFFFFF" }} />
                <Text style={{ color: "#FFFFFF" }}>Enviar</Text>
              </Button>
            }
          </FooterTab>
        </Footer2>
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
    sendDoc: (_docId, _fecha, _estado, _gps) => { dispatch(actionSendDoc(_docId, _fecha, _estado, _gps)); },
    updateDoc: (docId) => { dispatch(actionUpdateDoc(docId)); },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);