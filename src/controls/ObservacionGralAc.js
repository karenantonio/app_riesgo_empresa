import React, { Component, PureComponent } from 'react';
import { Input as Input2, Item, Label, Text, Button, Textarea, Content, Body, Picker } from 'native-base'
import { View, Alert, ImageBackground, Modal, ScrollView, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import MultiSelect from 'react-native-multiple-select';
import { connect } from 'react-redux';
import { actionSetValorControl } from '../store/actions'
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { getUID } from '../functions/common'
import { Icon } from 'react-native-elements'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

const optionsPhotos = {
  title: 'Seleccione imagen',
  quality: 0.8,
  maxWidth: 420,
  maxHeight: 560,
  includeBase64: true
};

const items = [
  {
    id: 1,
    name: 'Informar'
  },
  {
    id: 2,
    name: 'Reparar'
  },
  {
    id: 3,
    name: 'Capacitar'
  },
  {
    id: 4,
    name: 'Implementar'
  },
  {
    id: 5,
    name: 'Remplazar'
  }
];
class ObservacionGralAc extends React.Component {

  state = {
    titulo: "",
    titulo_obs: "",
    modal: false,
    observaciones: [],
    gravedad: "",
    accionc: [],
    fotos: [],
    plazo: null,
  }

  onSelectedItemsChange = accionc => {
    this.setState({ accionc });
  };

  takeMultiPhoto = () => {
    launchCamera(optionsPhotos, (response) => {
      if (response.didCancel) { }
      else if (response.error) { Alert.alert('ImagePicker Error: ', response.error); }
      else if (response.customButton) { }
      else {
        const file = { file: "data:" + response.type + ";base64," + response.base64 };
        let { fotos } = this.state;
        fotos.push({ id: getUID(), imagen: file });
        this.setState({ adjunto: file }); // Variable auxiliar para cargar el view de las fotos 
      }
    });
  }

  searchMultiPhoto = () => {
    launchImageLibrary(optionsPhotos, (response) => {
      if (response.didCancel) { }
      else if (response.error) { Alert.alert('ImagePicker Error: ', response.error); }
      else if (response.customButton) { }
      else {
        const file = { file: "data:" + response.type + ";base64," + response.base64 };
        this.state.fotos.push({ id: getUID(), imagen: file });
        this.setState({ adjunto: file });
      }
    });
  }

  deletePhoto = (foto) => {
    let { fotos } = this.state;
    this.setState({ fotos: fotos.filter(larow => larow.id !== foto.id) });
  }

  UNSAFE_componentWillMount() {
    let fecha;
    let titulo = this.props.configs.filter(row => row.Nombre === "titulo")[0].Valor;
    let titulo_obs = this.props.configs.filter(row => row.Nombre === "titulo_obs")[0].Valor;

    let configPlazo = this.props.configs.filter(row => row.Nombre === "plazo");
    let plazo = null;
    if (configPlazo.length) {
      plazo = JSON.parse(configPlazo[0].Valor);
    }


    if (plazo > 0) {
      let manana = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000 * plazo);
      fecha = ('0' + manana.getDate()).slice(-2) + '-' + ('0' + (manana.getMonth() + 1)).slice(-2) + '-' + manana.getFullYear();
    } else {
      fecha = '';
    }

    let observaciones = [];


    if (this.props.valores.filter(row => row.Nombre === "observaciones")[0].Valor != '""') {
      observaciones = JSON.parse(this.props.valores.filter(row => row.Nombre === "observaciones")[0].Valor)
    }

    this.setState({
      titulo,
      titulo_obs,
      observaciones,
      plazo,
      fecha
    });
  }

  render() {

    const { accionc } = this.state;

    return (
      <View>
        <Grid style={{ borderColor: "transparent", borderWidth: 1, borderRadius: 10, margin: 5, padding: 10, marginTop: '5%' }}>
          {/*           <Row style={{ justifyContent: 'center' }}>
            <Label style={{ marginLeft: 10, fontSize: 16, color: this.props.theme.primary }}>{this.state.titulo}</Label>
          </Row> */}
          <Row style={{ justifyContent: 'center' }}>
            {(this.state.observaciones.length > 0) &&
              <Row>
                <Grid style={{ marginTop: 10, marginBottom: 20 }}>
                  {this.state.observaciones.map((row, key) => {
                    return (
                      <Row key={key} style={{ marginTop: 10, borderColor: 'gray', borderWidth: 1, borderRadius: 6, padding: 5 }}>
                        <Col size={2}>
                          <Text>{row.comentario}</Text>
                        </Col>
                        <Grid style={{ alignItems: 'center' }}>
                          <Col>
                            {
                              <Button
                                small
                                primary
                                style={{ backgroundColor: this.props.theme.tertiary, marginLeft: 3, borderRadius: 20 }}
                                onPress={() => {
                                  //EDITAR:
                                  this.setState({
                                    modal: true,
                                    id: row.id,
                                    comentario: row.comentario,
                                    adjunto: row.adjunto,
                                    fotos: row.fotos,
                                    gravedad: row.gravedad,
                                    accionc: row.accionc,
                                    fecha: row.fecha,
                                  });
                                }}
                              >
                                <Body>
                                  <Icon
                                    name='edit'
                                    color={"white"}
                                    type="font-awesome"
                                  />
                                </Body>
                              </Button>
                            }
                          </Col>
                          <Col>
                            <Button
                              small
                              primary
                              style={{ backgroundColor: "#c90000", marginLeft: 3, marginRight: 10, borderRadius: 20 }}
                              onPress={() => {
                                //ELIMINAR:
                                Alert.alert('Eliminar', '¿Seguro que desea eliminar esta observación?',
                                  [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                                    text: 'OK', onPress: () => {
                                      let { observaciones } = this.state;
                                      this.setState({ observaciones: observaciones.filter(larow => larow.id !== row.id) });
                                    }
                                  },], { cancelable: false },
                                );
                              }}
                            >
                              <Body>
                                <Icon
                                  name='trash'
                                  color={"white"}
                                  type="font-awesome" />
                              </Body>
                            </Button>
                          </Col>
                        </Grid>
                      </Row>)
                  })
                  }
                </Grid>
              </Row>
            }
          </Row>
          <Row style={{ justifyContent: 'center', marginTop: 10 }}>
            <Icon name='plus' type='font-awesome' color='gray' size={80} resizeMode="contain" onPress={() => {

              let manana_format = null;
              if (this.state.plazo > 0) {
                const manana = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000 * this.state.plazo);
                manana_format = ('0' + manana.getDate()).slice(-2) + '-' + ('0' + (manana.getMonth() + 1)).slice(-2) + '-' + manana.getFullYear();
              } else {
                manana_format = '';
              }

              this.setState({ modal: true, fecha: manana_format, comentario: "", adjunto: "", id: "", fotos: [], gravedad: '', accionc: '' });
            }} />
          </Row>
        </Grid>

        {/* Modal que muestra formulario para ingresar observaciones generales */}
        <Modal animationType="fade" transparent={false} visible={this.state.modal} onRequestClose={() => { Alert.alert('Modal has been closed.'); }}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10, alignItems: 'center' }}>

              {/* Área para ingresar texto de observación */}
              <View style={{ marginTop: '5%' }}>
                <Icon name='message-text' type='material-community' color={this.props.theme.primary} size={35} resizeMode="contain" />
                <Label style={{ fontFamily: 'Roboto', fontSize: 16, color: 'grey' }}>
                  {this.state.titulo_obs}
                </Label>
              </View>
              <Item regular style={{ borderColor: "transparent" }}>
                <Content padder>
                  <Textarea
                    autoCapitalize='characters'
                    value={this.state.comentario}
                    rowSpan={4}
                    bordered placeholder=""
                    onChangeText={(value) => { this.setState({ comentario: value }); }}
                    style={{ backgroundColor: "#ffffff", borderRadius: 6, height: '100%', borderColor: 'grey' }}
                  />
                </Content>
              </Item>

              <View style={{ marginTop: '5%' }}>
                {/* <Icon name='camera' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain" /> */}
                <Label style={{ fontSize: 16, color: '88898D' }}>Evidencia</Label>
              </View>

              {/* Despliega la imagen tomada y/o adjuntada */}
              {this.state.adjunto !== "" ?
                <View style={{ flexGrow: 1, alignItems: 'center' }}>
                  {this.state.fotos.map((foto, i) =>
                    <ImageBackground key={i} resizeMode="contain" style={{ height: 170, width: 230, marginTop: '2%' }} source={{ uri: foto.imagen.file, isStatic: true }}>
                      <Row>
                        <Col></Col>
                        <Col>
                          <Button style={{ backgroundColor: '#c90000', marginLeft: 16, borderRadius: 30, width: 47, height: 47 }} block onPress={() => {
                            Alert.alert('Eliminar', '¿Seguro que desea eliminar esta foto?',
                              [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                                text: 'OK', onPress: () => {
                                  this.deletePhoto(foto);
                                }
                              },], { cancelable: false },
                            );
                          }}>
                            <Icon type="FontAwesome" name="close" style={{ fontSize: 20, color: "#ffffff" }} color='#ffffff' />
                          </Button>
                        </Col>
                      </Row>
                      <Row></Row>
                      <Row></Row>
                    </ImageBackground>
                  )}
                  <Item regular style={{ borderColor: "transparent", marginTop: '3%', alignItems: 'center' }}>
                    <Button style={{ backgroundColor: this.props.theme.primary, width: 70, marginRight: 20 }} small onPress={() => { this.takeMultiPhoto(); }}>
                      <Body>
                        <Icon name='camera' type="font-awesome" color={"#FFFFFF"} />
                      </Body>
                      <Text>+</Text>
                    </Button>
                    {/* <Text>  o</Text> */}
                    <Button small style={{ backgroundColor: this.props.theme.primary, width: 70, marginLeft: 10 }} onPress={() => { this.searchMultiPhoto() }}>
                      <Body>
                        <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                      </Body>
                      <Text>+</Text>
                    </Button>
                  </Item>
                </View>
                :
                /* Si aún no hay imagen muestra solo los botones */
                <Item regular style={{ borderColor: "transparent", marginTop: 10 }}>
                  <Button style={{ backgroundColor: this.props.theme.primary, width: 80, marginRight: 20 }} small onPress={() => { this.takeMultiPhoto(); }}>
                    <Body>
                      <Icon name='camera' type="font-awesome" color={"#FFFFFF"} />
                    </Body>
                    <Text>+</Text>
                  </Button>
                  {/* <Text>  o</Text> */}
                  <Button small style={{ backgroundColor: this.props.theme.primary, width: 70, marginLeft: 10 }} onPress={() => { this.searchMultiPhoto() }}>
                    <Body>
                      <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                    </Body>
                    <Text>+</Text>
                  </Button>
                </Item>
              }


              {/* Select Gravedad Potencial */}
              <Grid style={{ marginTop: '8%', marginLeft: '5%', marginRight: '5%' }}>
                <Label style={{ fontSize: 15, color: this.props.theme.primary, fontWeight: 'bold' }}>
                  {'Gravedad Potencial'}
                </Label>
                <Row>
                  <Col style={{
                    width: '100%',/*  */
                    borderBottomColor: 'gray',
                    borderBottomWidth: 2,
                    fontSize: 14,
                    minHeight: 50
                  }}>
                    <Picker
                      style={{ color: 'gray', width: '100%' }}
                      note
                      mode="dropdown"
                      selectedValue={this.state.gravedad}
                      onValueChange={(gravedad) => this.setState({ gravedad: gravedad })}
                    >
                      <Picker.Item label={'Seleccione'} value={''} />
                      <Picker.Item label={'Alta'} value={'Alta'} />
                      <Picker.Item label={'Media'} value={'Media'} />
                      <Picker.Item label={'Baja'} value={'Baja'} />
                    </Picker>
                  </Col>
                </Row>
              </Grid>


              {/* Accion Correctiva */}

              <Grid style={{ marginTop: '3%', marginLeft: '5%', marginRight: '5%' }}>
                <Label
                  style={{
                    marginLeft: 5,
                    marginTop: 15,
                    marginBottom: '2%',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: this.props.theme.primary,
                  }}>
                  {'Accion Correctiva'}
                </Label>
                <Row>
                  <Col style={{
                    width: '100%',
                    borderBottomColor: 'gray',
                    borderBottomWidth: 2,
                    fontSize: 14,
                    minHeight: 50
                  }}>
                    <View style={{ flex: 1, marginLeft: 5, width: '100%' }}>
                      <MultiSelect
                        hideTags
                        hideDropdown
                        items={items}
                        uniqueKey="name"
                        ref={(component) => { this.multiSelect = component }}
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={accionc}
                        selectText="Seleccione..."
                        searchInputPlaceholderText="Buscar..."
                        onChangeInput={(text) => console.log(text)}
                        altFontFamily="ProximaNova-Light"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor={this.props.theme.primary}
                        selectedItemIconColor={this.props.theme.primary}
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor={this.props.theme.primary}
                        submitButtonText="Aceptar"
                        tagContainerStyle={{ width: '100%' }}
                        styleTextTag={{ textAlign: 'left', color: 'black' }}
                      />
                    </View>
                  </Col>
                </Row>
              </Grid>





              {/* Calendario para seleccionar fecha */}
              <View style={{ marginTop: '10%' }}>
                <Icon name='calendar' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain" />
                <Label style={{ marginTop: 10, fontSize: 18, color: this.props.theme.primary }}>Fecha de Plazo </Label>
              </View>
              <View>
                <DatePicker
                  showIcon={false}
                  customStyles={{
                    dateTouchBody: { backgroundColor: 'transparent' }
                  }}
                  mode="date"
                  date={this.state.fecha}
                  placeholder="___ /___ /___"
                  format="DD-MM-YYYY"
                  minDate="01-01-1960"
                  maxDate="01-01-2040"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => { this.setState({ fecha: date }) }} />
              </View>

              {/* Botones Cancelar y Guardas */}
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: '10%' }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#c90000', margin: 20, borderRadius: 4, width: '40%', height: '60%', paddingTop: '2%' }}
                  onPress={async () => {
                    this.setState({ modal: false });
                  }}>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '15%', alignItems: 'center' }}>
                    <Icon size={25} name='close' type='font-awesome' color='#ffffff' />
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Cancelar</Text>
                  </View>

                </TouchableOpacity>

                <TouchableOpacity
                  style={{ backgroundColor: '#00C92F', margin: 20, borderRadius: 4, width: '40%', height: '60%', paddingTop: '2%' }}
                  onPress={async () => {
                    let { observaciones } = this.state;
                    if (this.state.id !== "") {
                      //ACTUALIZAR
                      if (this.state.comentario !== "") {
                        for (var i = 0; i < observaciones.length; i++) {
                          if (observaciones[i].id === this.state.id) {
                            observaciones[i].fecha = this.state.fecha;
                            //observaciones[i].adjunto = this.state.adjunto;                       
                            observaciones[i].comentario = this.state.comentario;
                            observaciones[i].fotos = this.state.fotos;
                            observaciones[i].gravedad = this.state.gravedad;
                            observaciones[i].accionc = this.state.accionc;
                          }
                        }
                        this.setState({ observaciones, modal: false });
                      } else {
                        Alert.alert('Falta información', 'Para guardar debe ingresar una observación.');
                      }
                    } else {
                      //NUEVO
                      if (this.state.comentario !== "") {
                        observaciones.push({
                          id: getUID(),
                          fecha: this.state.fecha,
                          //adjunto:this.state.adjunto,
                          comentario: this.state.comentario,
                          fotos: this.state.fotos,
                          gravedad: this.state.gravedad,
                          accionc: this.state.accionc
                        });
                        this.setState({ observaciones, modal: false });
                      } else {
                        Alert.alert('Falta información', 'Para guardar debe ingresar una observación.');
                      }
                    }
                    this.props.setValorControl(this.props.id, this.props.tipo, "observaciones", observaciones);
                  }}>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '15%', alignItems: 'center' }}>
                    <Icon size={25} name='save' color='#ffffff' />
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Guardar</Text>
                  </View>

                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Modal>
        {this.props.renderizar(this.props)}
      </View>);
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
  }
};

export default connect(null, mapDispatchToProps)(ObservacionGralAc);





