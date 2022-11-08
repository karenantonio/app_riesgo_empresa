import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item as Item2,Label,Text,ListItem,Body,Right,Button,Icon, Accordion, Col, Grid, Left } from 'native-base'
import {View,Modal,Alert,ScrollView, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux';
import {actionUpdateDoc} from '../store/actions'
import { Icon as IconNB } from 'react-native-elements'

class Row extends PureComponent {

  state = {
    modal:false,
  }

  componentWillMount()
  {
   if(this.props.newrow !== "")
   {
      if(this.props.newrow === this.props.orden.toString())
      {
          this.setState({modal:true});     
      }
   }
  }

  getTitleFromTypeControl()
  {

  }

  render() {
    //const configs = this.props.configs;
    //let titulo = configs.filter(row=>row.Nombre === "titulo")[0].Valor;

    //BUSCAR CONTROL QUE SERÁ VISIBLE EN LA ROW:
    let titulo = "";
    /*if(this.state.template.filter(row=>row.Configs.filter().length>0).length>0)
    {
      titulo = this.state.template.filter(row=>row.Configs.filter().length>0)[0]
    }*/

    let {controles} = this.props;
    if(controles.length>0)
    {
      if(controles[0].Tipo === "Texto")
      {
        titulo = JSON.parse(controles[0].Valores.filter(row=>row.Nombre === "texto")[0].Valor);
      }
      if(controles[0].Tipo === "Autocompletar")
      {
        const v = JSON.parse(controles[0].Valores.filter(row=>row.Nombre === "seleccionado")[0].Valor);
        titulo = v.Titulo;
      }
    }

    return ( 
      <View>
        <ListItem icon style={{borderTopWidth: 1, borderRightWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, borderRadius: 20, borderColor: 'gray', marginBottom: '1%'}}>
            
              <Body style={{borderBottomWidth:0, padding: 8}}>
              {titulo.length > 100 ? (
                <Text style={{color:"grey",fontSize:13}}>{titulo.substr(0, 100)} ...</Text>
              ):
                <Text style={{color:"grey",fontSize:13}}>{titulo}</Text>
              }
              </Body>
           

            <Right style={{borderBottomWidth:0}}>
                
                <Button small style={{backgroundColor: '#fccf61',borderRadius:20}} onPress={()=>{

                  this.setState({modal:true});
                }}>
                    <Icon type="FontAwesome" name={"edit"}/>
                </Button>
                

                <Button small style={{backgroundColor: '#c90000',borderRadius:20,marginLeft:5}} onPress={()=>{
                        Alert.alert('Eliminar','¿Seguro que desea eliminar este registro?',
                            [
                              {text: 'Cancelar',onPress: () => {},style: 'cancel'},
                              {text: 'OK', onPress: async () => {
                                this.props.delRowtoGroup(this.props.id);
                                await this.props.updateDoc(this.props.docId);
                                await this.props.reloadDoc(); 
                              }},
                            ],{cancelable: false},
                          );
                        }}>
                  <Icon type="FontAwesome" name={"trash"}/>
                </Button>
            </Right>
        </ListItem>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({modal: false});
          }}>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{marginTop: 10,paddingLeft:10,paddingRight:10}}>
            <View>
            {this.props.renderizar(this.props)}


            <View style={{flexDirection:"row",justifyContent:"center",marginTop:20}}>

                <TouchableOpacity style={{backgroundColor: '#c90000',margin:20,borderRadius:20, width: '40%', height:'65%'}}
                onPress={async () => {  
                  this.props.delRowtoGroup(this.props.id);
                  await this.props.updateDoc(this.props.docId);
                  await this.props.reloadDoc();              
                  await this.setState({modal:false})
                }}>
                    <IconNB size={50} name='close' type='font-awesome' color='#ffffff'/>
                    <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Salir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor: '#00c92f',margin:20,borderRadius:20, width: '40%', height:'65%'}}
                onPress={async () => {
                  await this.props.updateDoc(this.props.docId);
                  //await this.props.loadDocToState();
                  await this.props.reloadDoc();
                  let muestra = [];
                  let valida = this.props.controles.filter((control)=>(control.Configs[1].Valor === "False"));

                  try {
                    valida.map(control => {
                      if(control.Valores[0].Nombre === "texto"){
                        if(control.Valores[0].Valor === "\"\""){
                         muestra.push({control: control.Configs[0].Valor});
                        }
                      }
                      if(control.Valores[0].Nombre === "fechamongo"){
                        if(control.Valores[0].Valor === "\"\""){
                          muestra.push({control: control.Configs[0].Valor});
                         }
                      }
                    })                 
                  } catch (error) {
                    
                  }                
                  let msj = "";
                  if(muestra.length != 0){
                    muestra.map((item) =>
                      msj += "- "+item.control+". \n"  
                    )
                    Alert.alert('Campos Obligatorios', 'Debe completar los siguientes campos: \n'+msj);
                  } else {
                    this.setState({modal:false})
                  }
                  }}>
                    <IconNB size={50} name='save' color='#ffffff'/>
                    <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Guardar</Text>
                </TouchableOpacity>
                
            </View>

            </View>
          </View>
          </ScrollView>
        </Modal>

     </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      newrow:state.reducerNewRow,
  }
};
const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    updateDoc:(docId)=>{dispatch(actionUpdateDoc(docId));},
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(Row);
 





/*return(<View style={{borderWidth:1,borderColor:"#cbcbcb",marginTop:5,borderRadius:6,padding:5}}>
<View>
  <Button style={{backgroundColor:"red",borderRadius:10,marginLeft:5}} onPress={()=>{
  Alert.alert('Eliminar?','Seguro que desea eliminar este registro?',
      [
        {text: 'Cancel',onPress: () => {},style: 'cancel'},
        {text: 'OK', onPress: () => {

          //Alert.alert("",this.props.id.toString());

          this.props.delRowtoGroup(this.props.id);

          //const data = this.state.data.filter(row=>row.id !== item.id);
          //this.setState({data});


        }},
      ],{cancelable: false},
    );
  }}>
  <Icon type="FontAwesome" name={"trash"}/>
  </Button>
</View>
</View>
);*/