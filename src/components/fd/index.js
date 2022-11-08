import React, { Component } from 'react';
import Control from '../../controls/Control';
import { deleteEmptyDocument } from '../../realm/functions/common'
import { Spinner, Container, Header, FooterTab, Tab, Tabs, ScrollableTab, Body, Title, TabHeading, Text, Left, Right, View, Content, Item } from 'native-base';
import { connect } from 'react-redux';
import { actionClearValorControl, actionInsertValorControl } from '../../store/actions';
import { Alert, SectionList, FlatList, ListItem, Picker, ScrollView, Dimensions, NativeModules } from 'react-native';
import Footer from './Footer';
import { actionAddRowToDoc, actionDelRowToDoc, actionUpdateDoc } from '../../store/actions'
import { Icon } from 'react-native-elements'

global.scroll = 0;

const renderizar = (props) => {
  const id = props.id;
  const controles = props.controles;
  const self = props.self;
  const f1 = props.addRowtoGroup;
  const f2 = props.delRowtoGroup;
  const f3 = props.loadDocToState;
  const f4 = props.setScroll;
  const docId = props.docId;
  const listas = props.listas;
  const theme = props.theme;
  const reloadDoc = props.reloadDoc;
  const baseColor = props.baseColor;

  try {
    if (controles !== undefined)
      return controles.map(control => {
        const ctlLevel = id + '.' + control.Orden;
        //Alert.alert(ctlLevel,JSON.stringify(control));
        //AGREGAR CONTROL A LA LISTA DE VALORES:
        if (control.Valores !== undefined)
          for (var i = 0; i < control.Valores.length; i++) {
            self.props.insertValorControl(ctlLevel, control.Tipo, control.Valores[i].Nombre, JSON.parse(control.Valores[i].Valor), control.Configs);
          }
        return (
          <View key={ctlLevel + 'v'}>
            <Control
              id={ctlLevel}
              tipo={control.Tipo}
              orden={control.Orden}
              valores={control.Valores}
              template={control.Template}
              configs={control.Configs}
              setBackButton={control.setBackButton}
              addRowtoGroup={f1}
              delRowtoGroup={f2}
              loadDocToState={f3}
              setScroll={f4}
              controles={control.Controles}
              renderizar={renderizar}
              self={self}
              docId={docId}
              listas={listas}
              theme={theme}
              reloadDoc={reloadDoc}
              baseColor={baseColor}
            />
          </View>
        );
      });
  } catch (err) {
    Alert.alert("", err.toString());
  }
}


const displayControles = (
  callBack,
  parent,
  level,
  self,
  addRowtoGroup,
  delRowtoGroup,
  loadDocToState,
  setScroll,
  docId,
  listas,
  theme,
  reloadDoc,
  baseColor
) => {
  try {
    return (
      parent.Controles.map((child, key) => { /*sorted('Orden')*/
        let ctlLevel = level + '.' + child.Orden;
        //AGREGAR CONTROL A LA LISTA DE VALORES:
        for (var i = 0; i < child.Valores.length; i++) {
          self.props.insertValorControl(ctlLevel, child.Tipo, child.Valores[i].Nombre, JSON.parse(child.Valores[i].Valor), child.Configs);
        }
        return (
          <View key={ctlLevel + 'v'}>
            <Control
              id={ctlLevel}
              tipo={child.Tipo}
              orden={child.Orden}
              valores={child.Valores}
              template={child.Template}
              configs={child.Configs}
              setBackButton={callBack}
              addRowtoGroup={addRowtoGroup}
              delRowtoGroup={delRowtoGroup}
              loadDocToState={loadDocToState}
              setScroll={setScroll}
              controles={child.Controles}
              renderizar={renderizar}
              self={self}
              docId={docId}
              listas={listas}
              theme={theme}
              reloadDoc={reloadDoc}
              baseColor={baseColor}
            />
            {
              //displayControles(callBack,child, ctlLevel,self,addRowtoGroup,delRowtoGroup)
            }
          </View>
        );
      })
    );
  } catch (e) {
    Alert.alert(e.toString(), JSON.stringify(parent));
  }
}

class Formulario extends React.Component {

  state = {
    loading: true,
    backButton: null,
    scroll: 0,
    listas: []
  }

  constructor(props) {
    super(props);
    this.refs["_scrollView"] = null;
    this.setBackButton = this.setBackButton.bind(this);
    global.scroll = 0;
  }

  //ELIMINA UN ELEMENTO DE ROW AL DOCUMENTO ACTUAL Y A LA BASE DE DATOS
  async delRowtoGroup(idgrupo) {
    await this.props.delRowToDoc(idgrupo, this.props.doc._id);
    //await this.loadDocToState();
    this.reloadDoc()
  }
  //AGREGA UN ELEMENTO DE ROW AL DOCUMENTO ACTUAL Y A LA BASE DE DATOS
  async addRowtoGroup(idgrupo) {
    //CORRECCION. NO PUEDES ASIGNAR UN ID MUY ALTO. PUES NO PASARÁ POR APPSYNC
    await this.props.addRowToDoc(idgrupo, this.props.doc._id, parseInt((((new Date()).getTime()).toString()).slice(4)));
    //await this.loadDocToState();
    this.reloadDoc()
  }

  reloadDoc() {
    this.props.docReset();
  }

  setScroll(top) {
    const mitad_de_pantalla = Math.round(Dimensions.get('window').height / 2);

    if (top > mitad_de_pantalla) {
      const pasado_de_mitad = top - mitad_de_pantalla + 50; //(este margen de 50 casi no es necesario)

      //MOVER EL SCROLL:
      const scroll = global.scroll + pasado_de_mitad;

      //Alert.alert("scroll actual",scroll.toString());

      this.refs["_scrollView"].scrollTo({ x: 0, y: scroll, animated: true });

      global.scroll = scroll;
    }
  }

  setBackButton(callBack) {
    this.setState({ backButton: callBack });
  }

  loadDocToState() {
    this.props.clearValorControl();
    this.setState({ loading: false });
  }

  componentDidMount() {
    this.loadDocToState();
    this.props.setBackButton(() => {
      if (this.state.backButton === null) {
        if (this.props.readOnly === false)
          Alert.alert('Antención', 'Si sale del formulario sin guardar, se perderan los datos. \n\n(Si el formulario no tiene datos este no sera guardado)', [
            { text: 'Cancelar', onPress: () => { }, style: 'cancel', },
            {
              text: 'Salir', onPress: () => {
                // deleteEmptyDocument(this.props.doc._id);
                this.props.setInterface("Menu");
              }
            },
            {
              text: 'Guardar y salir', onPress: async () => {
                await this.props.updateDoc(this.props.doc._id);
                this.props.setInterface("Menu");
              }
            },
          ], { cancelable: false },
          );
        else
          this.props.setInterface("Documents"); 
      }
      else
        this.state.backButton();
    });
    const listas = this.props.listasf();
    this.setState({ listas });
  }

  render() {
    const readOnly = this.props.readOnly;
    return (
      <Container>
        {this.state.loading === true ? <Spinner color='blue' /> :
          <Content>

            <Header hasTabs searchBar style={{ backgroundColor: this.props.doc.Tag[0].Valor, borderBottomWidth: 0, borderBottomStartRadius: 20, borderBottomEndRadius: 20 }}>
              <Item style={{ backgroundColor: this.props.doc.Tag[0].Valor, padding: 0, margin: 0, borderRadius: 20, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>{this.props.doc.Title}</Text>
              </Item>
            </Header>

            <Tabs renderTabBar={() => <ScrollableTab
              underlineStyle={{ backgroundColor: this.props.doc.Tag[0].Valor }}
              style={{ backgroundColor: this.props.theme.fdHeaderBackGround }} />}>
              {
                this.props.doc !== null && this.props.doc.Pages.map(pagina => {
                  return (
                    <Tab
                      key={pagina.Orden}
                      heading={
                        <TabHeading style={{ backgroundColor: this.props.theme.fdHeaderBackGround }}>
                          {pagina.IconName !== "" && <Icon name={pagina.IconName} type={pagina.IconLibrary} color={pagina.IconColor} />}
                          {pagina.Nombre !== "" && <Text style={{ color: this.props.doc.Tag[0].Valor, fontSize: 12, margin: 0, fontWeight: 'bold' }}>{pagina.Nombre}</Text>}
                        </TabHeading>}
                    >

                      <ScrollView style={{ marginBottom: 20 }} keyboardShouldPersistTaps={'handled'} ref='_scrollView'
                        onMomentumScrollEnd={(e) => {
                          //Alert.alert("",e.nativeEvent.contentOffset.y.toString());
                          //this.setState({scroll:e.nativeEvent.contentOffset.y});
                          global.scroll = e.nativeEvent.contentOffset.y
                        }}>
                        <View style={{ paddingLeft: 10, paddingRight: 10 }} pointerEvents={readOnly ? 'none' : 'auto'}>
                          {
                            displayControles(
                              this.setBackButton,
                              pagina,
                              pagina.Orden,
                              this,
                              (a) => { this.addRowtoGroup(a) },
                              (a) => { this.delRowtoGroup(a) },
                              () => { this.loadDocToState() },
                              (a) => { this.setScroll(a); },
                              this.props.doc._id,
                              this.state.listas,
                              this.props.theme,
                              () => { this.reloadDoc() },
                              this.props.doc.Tag[0],
                            )
                          }
                        </View>
                        {/*<View style={{height:Math.round(Dimensions.get('window').height/2)}}></View>*/}
                      </ScrollView>
                    </Tab>
                  )
                })
              }
            </Tabs>
          </Content>
        }
        <Footer theme={this.props.theme} setInterface={this.props.setInterface} doc={this.props.doc} readOnly={this.props.readOnly} />
      </Container>
    );
  }
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    insertValorControl: (_id, _tipo, _clave, _valor, _config) => { dispatch(actionInsertValorControl(_id, _tipo, _clave, _valor, _config)); },
    clearValorControl: () => { dispatch(actionClearValorControl()); },
    addRowToDoc: (idgrupo, iddoc, newId) => { dispatch(actionAddRowToDoc(idgrupo, iddoc, newId)); },
    delRowToDoc: (idgrupo, iddoc) => { dispatch(actionDelRowToDoc(idgrupo, iddoc)); },
    updateDoc: (docId) => { dispatch(actionUpdateDoc(docId)); },
  }
};

export default connect(null, mapDispatchToProps)(Formulario);