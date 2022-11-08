import React, { Component, useState } from 'react';
import { Input, Item, Text, Button, Label, Content, Body, Textarea, Picker, ListItem, List } from 'native-base'
import { View, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Alert, Modal, FlatList, PermissionsAndroid } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { getUID } from '../functions/common'
import { actionSetValorControl } from '../store/actions'

const optionsPhotos = {
  title: 'Seleccione imagen',
  quality: 0.8,
  maxWidth: 420,
  maxHeight: 560,
  includeBase64: true
};

var cont;

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert('¡Atención!', 'No podrá tomar fotos si no otorga permisos.');
    }
  } catch (err) {
    console.warn(err);
  }
};

class GrupoIPS extends Component {

  state = {
    // Data de listas y valores seleccionados
    data_pro: [],
    data_con: [],
    data_gra: [],
    val_pro: "",
    val_con: "",
    val_gra: "",

    //Datos ingresados por modal
    modal: false,
    ruta: "",
    comentario: "",
    adjunto: "",
    rutas: [],
    array_fotos: [],
    id: "",
    filtro: "",

    //Botón cumple
    cumple: false,
    estado: "1",
    disable: false,

    //Modal conducta
    modal_con: false
  }

  takeMultiPhoto = () => {
    launchCamera(optionsPhotos, (response) => {
      if (response.didCancel) { }
      else if (response.error) { Alert.alert('ImagePicker Error: ', response.error); }
      else if (response.customButton) { }
      else {
        const file = { file: "data:" + response.type + ";base64," + response.base64 };
        this.state.array_fotos.push({ id: getUID(), imagen: file });
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
        this.state.array_fotos.push({ id: getUID(), imagen: file });
        this.setState({ adjunto: file });
      }
    });
  }

  deletePhoto = (foto) => {
    this.setState({ array_fotos: this.state.array_fotos.filter(larow => larow.id !== foto.id) });
  }

  validarVacio = () => {
    let { val_pro, val_gra, val_con, comentario } = this.state;
    if (val_pro == "") {
      return "Debe seleccionar un Proceso.";
    } else if (val_con == "") {
      return "Debe seleccionar una Conducta LGF.";
    } else if (comentario == "") {
      return "Debe ingresar un Comentario.";
    } else if (val_gra == "") {
      return "Debe seleccionar una Gravedad Potencial.";
    } else {
      return "";
    }
  }

  componentDidMount() {
    try {
      // Poblado de listas y filtro de Conductas
      const configs = this.props.configs;
      let data_pro, data_gra, data_con = [];
      let filtro = {};

      let nombre_lista_pro = configs.filter(row => row.Nombre === 'lista_pro')[0].Valor;
      let nombre_lista_gra = configs.filter(row => row.Nombre === 'lista_gra')[0].Valor;
      let nombre_lista_con = configs.filter(row => row.Nombre === 'lista_con')[0].Valor;

      let lista_pro = this.props.listas.filter(row => row.Codigo === nombre_lista_pro);
      let lista_gra = this.props.listas.filter(row => row.Codigo === nombre_lista_gra);
      let lista_con = this.props.listas.filter(row => row.Codigo === nombre_lista_con);

      if (lista_pro.length > 0) {
        data_pro = lista_pro[0].Items;
      }
      if (lista_gra.length > 0) {
        data_gra = lista_gra[0].Items;
      }
      if (lista_con.length > 0) {
        data_con = lista_con[0].Items;
      }

      // /     if (configs.filter(row => row.Nombre === 'filter').length > 0) {
      //         filtro = JSON.parse(configs.filter(row => row.Nombre === 'filter')[0].Valor);
      //       }

      this.setState({ data_pro, data_gra, data_con });
    } catch (error) {
      //console.log(error);
    }
  }

  UNSAFE_componentWillMount() {
    try {
      // Preparación de array de Rutas
      let rutas = [];
      let estado = "";

      if (this.props.valores.filter(row => row.Nombre === "rutas")[0].Valor != '""') {
        rutas = JSON.parse(this.props.valores.filter(row => row.Nombre === "rutas")[0].Valor)
      }
      if (this.props.valores.filter(row => row.Nombre === "estado")[0].Valor != '""') {
        estado = JSON.parse(this.props.valores.filter(row => row.Nombre === "estado")[0].Valor);
      }

      this.setState({ rutas, estado });
    } catch (error) {
      //console.log(error);
    }
  }

  render() {
    const configs = this.props.configs;
    const readOnly = this.props.self.props.readOnly;
    let titulo = configs.filter(row => row.Nombre === "titulo")[0].Valor;
    let boton = configs.filter(row => row.Nombre === "boton")[0].Valor;

    let { data_pro, data_gra, data_con } = this.state;
    
    requestCameraPermission();

    //Estado de cumple por defecto en 1 (No cumple e ingresó datos)
    this.props.setValorControl(this.props.id, this.props.tipo, "estado", "1");

    // if (this.state.filtro !== null) {
    //   try {
    //     data_con = data_con.filter(row => row[this.state.filtro.thisKey] === this.state.val_pro);
    //   } catch (error) {
    //     console.log("Error Filtro:"+error);
    //   }  
    // }

    return (

      <View pointerEvents={readOnly ? 'none' : 'auto'}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Grid><Row style={{ justifyContent: 'center', marginTop: '3%', marginBottom: 10 }}></Row></Grid>
          {boton === "False" ?
            <TouchableOpacity
              style={styles.boton}
              disabled={this.state.disable}
              onPress={() => {
                this.setState({ modal: true, ruta: titulo });
              }}>
              <Text style={styles.titulo}>{titulo}</Text>
            </TouchableOpacity >
            :
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {this.state.disable == true ?
                <TouchableOpacity
                  style={styles.boton_nocumple}
                  onPress={() => {
                    this.props.setValorControl(this.props.id, this.props.tipo, "estado", "1");
                    this.setState({ disable: false });
                    Alert.alert('Aviso', 'La faena ya no cumple con las conductas esperadas.');
                  }}>
                  <Text style={{ paddingVertical: 8, borderRadius: 6, textAlign: "center", fontSize: 18, color: "#ffffff", fontWeight: 'bold' }}>
                    Cancelar confirmación de cumplimiento
                  </Text>
                </TouchableOpacity >
                :
                <TouchableOpacity
                  style={styles.boton_cumple}
                  onPress={() => {
                    Alert.alert('Confirmación', '¿Estás seguro que quieres confirmar que la faena cumple con las conductas esperadas?',
                      [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                        text: 'Confirmar', onPress: () => {
                          this.setState({ disable: true });
                          this.props.setValorControl(this.props.id, this.props.tipo, "estado", "0");
                        }
                      },], { cancelable: false },
                    );
                  }}>
                  <Text style={{ paddingVertical: 8, borderRadius: 6, textAlign: "center", fontSize: 18, color: "#ffffff", fontWeight: 'bold' }}>
                    {titulo}
                  </Text>
                </TouchableOpacity >
              }
            </View>
          }

        </View>

        {/* Modal que muestra formulario para ingresar observaciones generales */}
        <Modal animationType="fade" transparent={false} visible={this.state.modal} onRequestClose={() => { this.setState({ modal: false }) }}>
          <View style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <View style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10, alignItems: 'center' }}>
                <View style={{ marginTop: '5%', alignItems: 'center', justifyContent: 'center' }}>
                  <Label style={{ fontSize: 20, fontWeight: 'bold', color: this.props.theme.primary, marginBottom: 10, textAlign: 'center' }}>{this.state.ruta.toUpperCase()}</Label>
                </View>

                {/* Picker de Proceso */}
                <Grid style={{ marginTop: 15, marginLeft: '5%', marginRight: '5%' }}>
                  <Label style={{ fontSize: 15, color: this.props.theme.primary, fontWeight: 'bold' }}>PROCESO</Label>
                  <Row>
                    <Col style={{
                      width: '100%', borderBottomColor: this.props.baseColor.Valor,
                      borderBottomWidth: 2,
                      fontSize: 14,
                      minHeight: 50
                    }}>
                      <Picker style={{ color: this.props.baseColor.Valor, width: '100%' }}
                        note
                        mode="dropdown"
                        selectedValue={this.state.val_pro}
                        onValueChange={(pro) => this.setState({ val_pro: pro, val_con: "" })}>
                        <Picker.Item label={'Seleccione'} value={''} />
                        {data_pro.map((item, i) =>
                          <Picker.Item key={i} label={item.Texto1} value={item.Texto1} />
                        )}
                      </Picker>
                    </Col>
                  </Row>
                </Grid>

                {/* Picker de Conducta */}
                <Grid style={{ marginTop: 15, marginLeft: '5%', marginRight: '5%' }}>
                  <Label style={{ fontSize: 15, color: this.props.theme.primary, fontWeight: 'bold' }}>CONDUCTA LGF</Label>
                  <Row>
                    <Col
                      style={{
                        width: '100%',
                        borderBottomColor: this.props.baseColor.Valor,
                        borderBottomWidth: 2,
                        fontSize: 14,
                        minHeight: 50
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ modal_con: true });
                          cont = 1;
                        }}
                        style={{
                          borderBottomColor: this.props.baseColor.Valor,
                          fontSize: 14,
                          minHeight: 50,
                        }}>
                        {this.state.val_con ?
                          <Text style={{ color: this.props.baseColor.Valor, fontSize: 16 }}>
                            {this.state.val_con}
                          </Text>
                          :
                          <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, justifyContent: "space-between" }}>
                            <Text
                              style={{
                                color: this.props.baseColor.Valor,
                                fontSize: 16,
                                paddingLeft: '2%',
                              }}>
                              {'Seleccione'}
                            </Text>
                            <View style={{ paddingRight: '6%' }}>
                              <Icon type="font-awesome" name="caret-down" size={14} color={this.props.baseColor.Valor} />
                            </View>
                          </View>
                        }
                      </TouchableOpacity>
                      <Modal
                        onRequestClose={() => {
                          this.setState({ modal_con: false })
                        }}
                        hardwareAccelerated={true}
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modal_con}>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: 'white'
                          }}>
                          <List
                            style={{
                              borderBottomColor: this.props.baseColor.Valor,
                              borderBottomWidth: 2,
                              marginLeft: 10,
                              marginRight: 10,
                              marginBottom: '5%',
                              backgroundColor: 'white'
                            }}>
                            <View>
                              <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 10, marginTop: 5, color: this.props.baseColor.Valor }}>
                                CONDUCTAS LGF
                              </Text>
                            </View>
                            <FlatList
                              data={data_con}
                              keyExtractor={(item, index) => index.toString()}
                              extraData={this.state}
                              renderItem={({ item }) => (
                                <ListItem
                                  noIndent
                                  style={{
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'gray',
                                    borderTopColor: 'gray'
                                  }}
                                  onPress={() => {
                                    this.setState({ modal_con: false })
                                    this.setState({ val_con: item.Texto1 });
                                  }}>
                                  <View>
                                    <Text style={{ alignSelf: 'stretch' }}>
                                      {item.Texto1 + ''}
                                    </Text>
                                  </View>
                                </ListItem>
                              )}
                            />
                          </List>
                        </View>
                      </Modal>
                    </Col>
                  </Row>
                </Grid>

                {/* Área para ingresar texto de observación */}
                <View style={{ marginTop: 50 }}>
                  <Icon name='comment' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain" />
                </View>
                <Item regular style={{ borderColor: "transparent" }}>
                  <Content padder>
                    <Textarea autoCapitalize='characters' value={this.state.comentario} rowSpan={4} bordered placeholder="Escriba su observación." onChangeText={(value) => { this.setState({ comentario: value }); }} style={{ backgroundColor: "#ffffff", borderRadius: 20, height: '100%', borderColor: this.props.theme.primary, textAlign: 'center' }} />
                  </Content>
                </Item>

                {/* Picker de Gravedad Potencial*/}
                <Grid style={{ marginTop: 50, marginLeft: '5%', marginRight: '5%' }}>
                  <Label style={{ fontSize: 15, color: this.props.theme.primary, fontWeight: 'bold' }}>GRAVEDAD POTENCIAL</Label>
                  <Row>
                    <Col style={{
                      width: '100%', borderBottomColor: this.props.baseColor.Valor,
                      borderBottomWidth: 2,
                      fontSize: 14,
                      minHeight: 50
                    }}>
                      <Picker style={{ color: this.props.baseColor.Valor, width: '100%' }}
                        note
                        mode="dropdown"
                        selectedValue={this.state.val_gra}
                        onValueChange={(gra) => this.setState({ val_gra: gra })}>
                        <Picker.Item label={'Seleccione'} value={''} />
                        {data_gra.map((item, i) =>
                          <Picker.Item key={i} label={item.Texto1} value={item.Texto1} />
                        )}
                      </Picker>
                    </Col>
                  </Row>
                </Grid>

                <View style={{ marginTop: '5%' }}>
                  <Label style={{ fontSize: 18, color: this.props.theme.primary, marginBottom: 20 }}>Fotografías</Label>
                  <Icon name='camera' type='font-awesome' color='gray' size={50} resizeMode="contain" />
                </View>

                {/* Despliega la imagen tomada y/o adjuntada */}
                {this.state.adjunto !== "" ?
                  <View>
                    {this.state.array_fotos.map((foto, i) =>
                      <ImageBackground key={i} resizeMode="contain" style={{ height: 170, width: 230, marginTop: 10 }} source={{ uri: foto.imagen.file, isStatic: true }}>
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
                    <Item regular style={{ borderColor: "transparent", marginTop: 10, marginBottom: 10 }}>
                      <Button style={{ backgroundColor: this.props.theme.tertiary, width: 70 }} small onPress={() => { this.takeMultiPhoto() }}>
                        <Body>
                          <Icon name='camera' type="font-awesome" color={"#FFFFFF"} />
                        </Body>
                        <Text>+</Text>
                      </Button>
                      <Text>  o</Text>
                      <Button small style={{ backgroundColor: this.props.theme.tertiary, width: 70, marginLeft: 10 }} onPress={() => { this.searchMultiPhoto() }}>
                        <Body>
                          <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                        </Body>
                        <Text>+</Text>
                      </Button>
                    </Item>
                  </View>
                  :
                  /* Si aún no hay imagen muestra solo los botones */
                  <Item regular style={{ borderColor: "transparent", marginTop: 10, marginBottom: 10 }}>
                    <Button style={{ backgroundColor: this.props.theme.tertiary, width: 70 }} small onPress={() => { this.takeMultiPhoto() }}>
                      <Body>
                        <Icon name='camera' type="font-awesome" color={"#FFFFFF"} />
                      </Body>
                      <Text>+</Text>
                    </Button>
                    <Text>  o</Text>
                    <Button small style={{ backgroundColor: this.props.theme.tertiary, width: 70, marginLeft: 10 }} onPress={() => { this.searchMultiPhoto() }}>
                      <Body>
                        <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                      </Body>
                      <Text>+</Text>
                    </Button>
                  </Item>
                }

                {/* View que lista las rutas ingresadas*/}
                {this.state.rutas != "" ?
                  this.state.rutas.map((ruta, i) =>
                    <View key={i} style={styles.caja}>
                      <Text style={{ fontSize: 14, color: this.props.theme.primary, fontWeight: 'bold', marginTop: 10 }}>PROCESO</Text>
                      <Text style={{ fontSize: 18, color: 'white' }}>{ruta.pro}</Text>

                      <Text style={{ fontSize: 14, color: this.props.theme.primary, fontWeight: 'bold', marginTop: 10 }}>CONDUCTA LGF</Text>
                      <Text style={{ fontSize: 18, color: 'white' }}>{ruta.con}</Text>

                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Icon name='comment' type='font-awesome' color={this.props.theme.primary} size={25} />

                        <Text style={{ fontSize: 16, color: 'white', marginLeft: 10, marginRight: 50 }}>{ruta.comentario}</Text>

                      </View>

                      <Text style={{ fontSize: 14, color: this.props.theme.primary, fontWeight: 'bold', marginTop: 10 }}>GRAVEDAD</Text>
                      <Text style={{ fontSize: 18, color: 'white' }}>{ruta.gra}</Text>

                      <Button onPress={() => {
                        //ELIMINAR:
                        Alert.alert('Eliminar', '¿Seguro que desea eliminar esta ruta?',
                          [{ text: 'Cancelar', onPress: () => { }, style: 'cancel' }, {
                            text: 'OK', onPress: () => {
                              let { rutas } = this.state;
                              rutas = rutas.filter(r => r.id !== ruta.id);
                              this.setState({ rutas });
                              this.props.setValorControl(this.props.id, this.props.tipo, "rutas", rutas);
                            }
                          },], { cancelable: false },
                        );
                      }} small primary style={{ backgroundColor: "#c90000", marginLeft: '85%', marginRight: 10, borderRadius: 10, width: '10%' }}><Body><Icon name='trash' color={"white"} type="font-awesome" /></Body></Button>
                    </View>
                  )
                  :
                  <View>
                  </View>
                }

              </View>
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
              <TouchableOpacity style={styles.boton_nueva}
                onPress={async () => {
                  this.setState({ modal: false });
                }}>
                <Text style={styles.texto_modal}>NUEVA RUTA FAENA</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.boton_agregar}
                onPress={async () => {
                  let { rutas } = this.state;
                  if (this.state.id !== "") {
                    //ACTUALIZAR
                    if (this.state.comentario !== "") {
                      for (var i = 0; i < rutas.length; i++) {
                        if (rutas[i].id === this.state.id) {
                          rutas[i].pro = this.state.val_pro;
                          rutas[i].con = this.state.val_con;
                          rutas[i].gra = this.state.val_gra;
                          rutas[i].comentario = this.state.comentario;
                          rutas[i].fotos = this.state.array_fotos;
                        }
                      }
                      this.setState({ rutas });
                    } else {
                      //Alert.alert('Falta información','Para guardar debe ingresar una observación.');
                    }
                  } else {
                    //NUEVO
                    if (this.validarVacio() == "") {
                      rutas.push({
                        id: getUID(),
                        pro: this.state.val_pro,
                        con: this.state.val_con,
                        gra: this.state.val_gra,
                        comentario: this.state.comentario,
                        fotos: this.state.array_fotos
                      });
                      this.setState({ rutas, comentario: "", val_pro: "", val_gra: "", val_con: "", array_fotos: [], adjunto: "" });
                    } else {
                      Alert.alert('Falta información', this.validarVacio());
                    }
                  }
                  this.props.setValorControl(this.props.id, this.props.tipo, "rutas", rutas);
                }}>
                <Text style={styles.texto_modal}>AGREGAR PROCESO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {this.props.renderizar(this.props)}</View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
  }
};

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#32645c",
    width: "80%"
  },
  titulo: {
    paddingVertical: 8,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 26,
    color: "#ffffff"
  },
  boton_cumple: {
    borderRadius: 30,
    backgroundColor: "#88898D",
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '40%',
    padding: 10
  },
  boton_nocumple: {
    borderRadius: 30,
    backgroundColor: "#ff000d",
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '40%',
    padding: 10
  },
  boton_nueva: {
    borderRadius: 8,
    backgroundColor: "#88898D",
    justifyContent: 'center',
    width: '40%',
    margin: 15
  },
  boton_agregar: {
    borderRadius: 8,
    backgroundColor: "#32645c",
    justifyContent: 'center',
    width: '40%',
    margin: 15
  },
  texto_modal: {
    paddingVertical: 8,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 15,
    color: "#ffffff"
  },
  caja: {
    borderRadius: 20,
    backgroundColor: "#B1B1B1",
    width: '95%',
    margin: 5,
    paddingTop: 5,
    paddingLeft: 25,
    paddingBottom: 15
  }
});

export default connect(null, mapDispatchToProps)(GrupoIPS);

