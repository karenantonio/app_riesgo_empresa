import React, { Component, PureComponent } from 'react';
import { Input as Input2, Item, Label, Textarea, Content, Text } from 'native-base'
import { View } from 'react-native'
import { actionSetValorControl } from '../store/actions'
import { connect } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { TextInput } from 'react-native';

class Texto extends React.Component {

  state = {
    texto: "",
    okRut: false
  }

  componentDidMount() {
    //SET VALORES, LOS VALORES SIEMPRE HAY QUE PARSEARLOS:
    const texto = JSON.parse(this.props.valores.filter(row => row.Nombre === "texto")[0].Valor)
    this.setState({ texto });
  }

  Fn = {
    // Valida el rut con su cadena completa "XXXXXXXX-X"
    validaRut: function (rutCompleto) {
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
        return false;
      var tmp = rutCompleto.split('-');
      var digv = tmp[1];
      var rut = tmp[0];
      if (digv == 'K') digv = 'k';
      return (this.dv(rut) == digv);
    },
    dv: function (T) {
      var M = 0, S = 1;
      for (; T; T = Math.floor(T / 10))
        S = (S + T % 10 * (9 - M++ % 6)) % 11;
      return S ? S - 1 : 'k';
    }
  }

  render() {
    const configs = this.props.configs;

    let titulo = configs.filter(row => row.Nombre === "titulo")[0].Valor;
    let isMultilinea = false;
    let lineas = 3;
    let isNumber = false;
    let isRut = false;
    let isEditable = false;

    //SI EXISTE LA CONFIGURACION DE MULTILINEA:
    if (configs.filter(row => row.Nombre === "multilinea").length > 0) {
      isMultilinea = true;
      lineas = JSON.parse(configs.filter(row => row.Nombre === "multilinea")[0].Valor);
    }

    if (configs.filter(row => row.Nombre === "numero").length > 0) {
      if (configs.filter(row => row.Nombre === "numero")[0].Valor == "True") {
        isNumber = true;
      }
    }

    if (configs.filter(row => row.Nombre === "editable").length > 0) {
      isEditable = true;
    }

    if (configs.filter(row => row.Nombre === "rut").length > 0) {
      isRut = true;
    }

    const toast = (msj) => {
      ToastAndroid.showWithGravityAndOffset(
        msj,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    };


    return (<View>
      <View>
        <Label style={{ marginLeft: 5, marginTop: 20, fontSize: 14, color: this.props.baseColor.Valor, fontWeight: 'bold' }}>
          {titulo.toUpperCase()}
        </Label>
        <Item regular style={{ borderColor: "transparent" }}>


          {isEditable === true ?
            <Input2 placeholder=''
              style={{ borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2, margin: 0, padding: 6, fontSize: 14 }}
              editable={false}
              onChangeText={(value) => {
                this.props.setValorControl(this.props.id, this.props.tipo, "texto", value);
                this.setState({ texto: value });
              }} autoCapitalize='characters'
              value={this.state.texto}
            />
            :
            isNumber === true ? (
              <Input2 pattern="[0-9]*"
                style={{ borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2, margin: 0, padding: 6, fontSize: 14 }}
                onChangeText={(value) => {
                  this.props.setValorControl(this.props.id, this.props.tipo, "texto", value);
                  this.setState({ texto: value });
                }} autoCapitalize='none'
                value={this.state.texto}
                keyboardType={'numeric'}
              />
            ) :
              (isMultilinea === true ? (
                <Content padder>
                  <Textarea autoCapitalize='characters' rowSpan={lineas} bordered placeholder="" onChangeText={(value) => {
                    this.props.setValorControl(this.props.id, this.props.tipo, "texto", value);
                    this.setState({ texto: value });
                  }} style={{ borderColor: this.props.baseColor.Valor, borderBottomWidth: 2, borderRadius: 30, height: '100%' }}
                    value={this.state.texto}
                  />
                </Content>
              ) :
                isRut === true ?
                  <TextInput placeholder="Ejemplo: 12345678-9" onChangeText={(value) => {
                    this.props.setValorControl(this.props.id, this.props.tipo, "texto", value);
                    this.setState({ texto: value });
                  }}
                    onEndEditing={(value) => {
                      if (!this.Fn.validaRut(value.nativeEvent.text)) {
                        this.props.setValorControl(this.props.id, this.props.tipo, "texto", "");
                        this.setState({ texto: "" });
                        toast("El RUT ingresado no es válido.");
                      } else {
                        this.props.setValorControl(this.props.id, this.props.tipo, "texto", value.nativeEvent.text);
                        this.setState({ texto: value.nativeEvent.text });
                      }
                    }}
                    style={{ width: '100%', borderColor: this.props.baseColor.Valor, borderBottomWidth: 2, borderRadius: 30, height: '100%' }}
                    value={this.state.texto}
                  />
                  :
                  <Input2 placeholder=''
                    style={{ borderBottomColor: this.props.baseColor.Valor, borderBottomWidth: 2, margin: 0, padding: 6, fontSize: 14 }}
                    onChangeText={(value) => {
                      this.props.setValorControl(this.props.id, this.props.tipo, "texto", value);
                      this.setState({ texto: value });
                    }} autoCapitalize='characters'
                    value={this.state.texto}
                  />
              )}
        </Item>
      </View>
      {this.props.renderizar(this.props)}</View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
  }
};

export default connect(null, mapDispatchToProps)(Texto);