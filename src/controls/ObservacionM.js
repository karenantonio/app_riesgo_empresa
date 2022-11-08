import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Text,Button,Textarea,Content, Body} from 'native-base'
import {View, Alert, ImageBackground, Modal, ScrollView, TouchableOpacity, PermissionsAndroid} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import {getUID} from '../functions/common'
import {Icon} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const optionsPhotos = {
  title: 'Seleccione imagen',
  quality: 0.8,
  maxWidth:420,
  maxHeight:560,
  includeBase64: true
};

class ObservacionM extends React.Component {

    state = {
      titulo:"",
      modal:false,
      observaciones:[],
      fotos:[]
    }
  
      takeMultiPhoto = () =>{
        launchCamera(optionsPhotos, (response) => {
          if (response.didCancel) {}
            else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
            else if (response.customButton) {}
            else {
              const file = {file:"data:" + response.type + ";base64," + response.base64};
              let {fotos} = this.state;
              fotos.push({id:getUID(), imagen:file});
              this.setState({adjunto:file}); // Variable auxiliar para cargar el view de las fotos 
            }
        });
      }
    
      searchMultiPhoto = () =>{
        launchImageLibrary(optionsPhotos, (response) => {
          if (response.didCancel) {}
            else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
            else if (response.customButton) {}
            else {
              const file = {file:"data:" + response.type + ";base64," + response.base64};
              this.state.fotos.push({id:getUID(), imagen:file});
              this.setState({adjunto:file});
            }
        });
      }
    
      deletePhoto = (foto) =>{
        let {fotos} = this.state;
        this.setState({fotos:fotos.filter(larow=>larow.id!==foto.id)}); 
      }

    componentWillMount()
    {
      let titulo        = this.props.configs.filter(row=>row.Nombre === "titulo")[0].Valor;
      
      let observaciones = [];

      if(this.props.valores.filter(row=>row.Nombre==="observaciones")[0].Valor != '""')
      {
        observaciones = JSON.parse(this.props.valores.filter(row=>row.Nombre==="observaciones")[0].Valor)
      }

      this.setState({
        titulo,
        observaciones
      });
    }
     
    render() {
      return (<View> 
        <Grid style={{borderColor:"grey",borderWidth:1,borderRadius:20,margin:5,padding:10}}>
          <Row style={{justifyContent: 'center'}}>
            <Label style={{marginLeft:10,fontSize:16, color: this.props.theme.primary}}>{this.state.titulo}</Label>
          </Row>
          <Row style={{justifyContent: 'center'}}>
          {(this.state.observaciones.length>0) &&
            <Row>
              <Grid style={{marginTop:10}}>       
                {this.state.observaciones.map((row,key)=>{
                return(<Row key={key} style={{marginTop:10, borderColor: 'gray', borderWidth: 1, borderRadius: 20, padding: 5}}>       
                  <Col size={2}>
                    <Text>{row.comentario}</Text>
                  </Col>
                  <Grid style={{alignItems: 'center'}}>
                  <Col>{<Button onPress={()=>{
                    //EDITAR:
                    this.setState({modal:true,fecha:row.fecha,comentario:row.comentario,adjunto:row.adjunto,id:row.id, fotos:row.fotos});
                  }} small primary style={{backgroundColor:this.props.theme.tertiary,marginLeft:3, borderRadius: 20}}><Body><Icon name='edit' color={"white"} type="font-awesome"/></Body></Button>}</Col>
                  <Col><Button onPress={()=>{
                    //ELIMINAR:
                    Alert.alert('Eliminar','¿Seguro que desea eliminar esta observación?',
                      [{text: 'Cancelar',onPress: () => {},style: 'cancel'},{text: 'OK', onPress: () => {
                        let {observaciones} = this.state;
                        this.setState({observaciones:observaciones.filter(larow=>larow.id!==row.id)});  
                        }},],{cancelable: false},
                    );
                  }} small primary style={{backgroundColor:"#c90000",marginLeft:3, marginRight: 10, borderRadius: 20}}><Body><Icon name='trash' color={"white"} type="font-awesome"/></Body></Button></Col>
                  </Grid>
                </Row>)})
                }
              </Grid>
            </Row>
          }       
          </Row>
          <Row style={{justifyContent: 'center', marginTop:10}}>
            <Icon name='plus' type='font-awesome' color='gray' size={50} resizeMode="contain" onPress={()=>{
              const manana = new Date((new Date()).getTime() + 24*60*60*1000);
              const manana_format = ('0' + manana.getDate()).slice(-2) + '-' + ('0' + (manana.getMonth()+1)).slice(-2) + '-' + manana.getFullYear();
              this.setState({modal:true,fecha:manana_format,comentario:"",adjunto:"",id:"",fotos:[]});
            }}/>
          </Row>             
        </Grid>        

        {/* Modal que muestra formulario para ingresar observaciones generales */}
        <Modal animationType="fade" transparent={false} visible={this.state.modal} onRequestClose={() => {Alert.alert('Modal has been closed.');}}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={{marginTop: 10,paddingLeft:10,paddingRight:10, alignItems: 'center'}}>

            {/* Área para ingresar texto de observación */}
            <View style={{marginTop: '5%'}}>
              <Icon name='comment' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain"/>
              <Label style={{fontSize:18,color: this.props.theme.primary}}>Observación General</Label>
            </View>
            <Item regular style={{borderColor:"transparent"}}>
              <Content padder>
                <Textarea autoCapitalize='characters' value={this.state.comentario} rowSpan={4} bordered placeholder="" onChangeText={(value)=>{this.setState({comentario:value});}} style={{backgroundColor:"#ffffff",borderRadius:20, height: '100%', borderColor: this.props.theme.primary}}/>
              </Content>
            </Item>
        
            <View style={{marginTop: '5%'}}>
              <Icon name='camera' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain"/>
              <Label style={{fontSize:18,color: this.props.theme.primary}}>Imagen</Label>
            </View>

            {/* Despliega la imagen tomada y/o adjuntada */}      
            {this.state.adjunto !== "" ?
              <View>
              {this.state.fotos.map((foto, i) =>
                <ImageBackground key={i} resizeMode="contain" style={{height:170,width:230,marginTop:10}} source={{uri:foto.imagen.file, isStatic:true}}>
                  <Row>
                    <Col></Col>
                    <Col>
                      <Button style={{backgroundColor: '#c90000', marginLeft: 16,borderRadius:30, width: 47, height: 47}} block onPress={()=>{
                        Alert.alert('Eliminar','¿Seguro que desea eliminar esta foto?',
                        [{text: 'Cancelar',onPress: () => {},style: 'cancel'},{text: 'OK', onPress: () => {
                          this.deletePhoto(foto);
                        }},],{cancelable: false},
                        );
                        }}>
                        <Icon type="FontAwesome" name="close" style={{fontSize:20, color:"#ffffff"}} color='#ffffff'/>
                      </Button>
                    </Col>
                  </Row>
                  <Row></Row>
                  <Row></Row>
                </ImageBackground>  
              )}   
                <Item regular style={{borderColor:"transparent",marginTop:10}}>
                  <Button style={{backgroundColor:this.props.theme.tertiary,width:70}} small onPress={()=>{this.takeMultiPhoto();}}>
                    <Body>
                      <Icon name='camera' type="font-awesome" color={"#FFFFFF"}/>
                    </Body>
                    <Text>+</Text>
                  </Button>
                  <Text>  o</Text>
                  <Button small style={{backgroundColor:this.props.theme.tertiary,width:70,marginLeft:10}}onPress={()=>{this.searchMultiPhoto()}}>
                    <Body>
                      <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                    </Body>
                    <Text>+</Text>
                  </Button>
                </Item>             
              </View> 
              :
              /* Si aún no hay imagen muestra solo los botones */
              <Item regular style={{borderColor:"transparent",marginTop:10}}>
                <Button style={{backgroundColor:this.props.theme.tertiary,width:70}} small onPress={()=>{this.takeMultiPhoto();}}>
                  <Body>
                    <Icon name='camera' type="font-awesome" color={"#FFFFFF"}/>
                  </Body>
                  <Text>+</Text>
                </Button>
                <Text>  o</Text>
                <Button small style={{backgroundColor:this.props.theme.tertiary,width:70,marginLeft:10}}onPress={()=>{this.searchMultiPhoto()}}>
                  <Body>
                    <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                  </Body>
                  <Text>+</Text>
                </Button>
              </Item>             
            }        

            {/* Calendario para seleccionar fecha */}
            <View style={{marginTop: '3%'}}>
              <Icon name='calendar' type='font-awesome' color={this.props.theme.primary} size={50} resizeMode="contain"/>
              <Label style={{marginTop:10,fontSize:18,color: this.props.theme.primary}}>Fecha de Plazo</Label>
            </View>
            <View>
              <DatePicker
              showIcon={false}
              customStyles={{
                dateTouchBody: {backgroundColor: 'transparent'}
              }}
              mode="date"
              date={this.state.fecha}
              placeholder="___ /___ /___"
              format="DD-MM-YYYY"
              minDate="01-01-1960"
              maxDate="01-01-2040"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({fecha:date})}} />
            </View>

            <View style={{flexDirection:"row",justifyContent:"center",marginTop:20}}>
              <TouchableOpacity style={{backgroundColor: '#c90000',margin:20,borderRadius:20, width: '30%'}}
                onPress={async () => {
                  this.setState({modal:false});
                  }}>
                <Icon size={50} name='close' type='font-awesome' color='#ffffff'/>
                <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{backgroundColor: '#00c92f',margin:20,borderRadius:20, width: '30%'}}
              onPress={async () => {
                let {observaciones} = this.state;
                if(this.state.id!==""){
                  //ACTUALIZAR
                  if(this.state.comentario!==""){
                    for(var i=0;i<observaciones.length;i++){
                      if(observaciones[i].id === this.state.id){
                        observaciones[i].fecha = this.state.fecha;
                        //observaciones[i].adjunto = this.state.adjunto;                       
                        observaciones[i].comentario = this.state.comentario;
                        observaciones[i].fotos = this.state.fotos;
                      }
                    }
                    this.setState({observaciones,modal:false});
                  }else{
                    Alert.alert('Falta información','Para guardar debe ingresar una observación.');
                  }                 
                }else{
                  //NUEVO
                  if(this.state.comentario!==""){
                    observaciones.push({
                      id:getUID(),
                      fecha:this.state.fecha,
                      //adjunto:this.state.adjunto,
                      comentario:this.state.comentario,
                      fotos:this.state.fotos                     
                    });
                    this.setState({observaciones,modal:false});
                  }else{
                    Alert.alert('Falta información','Para guardar debe ingresar una observación.');
                  }
                }
                this.props.setValorControl(this.props.id,this.props.tipo,"observaciones",observaciones);            
              }}>
                <Icon size={50} name='save' color='#ffffff'/>
                <Text style={{color: 'white', fontSize: 20, textAlign: 'center'}}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>        
        {this.props.renderizar(this.props)}
      </View>);
    }
  }
  
  const mapDispatchToProps = (dispatch,ownProps) => {
    return {
      setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
    }
  };
  
  export default connect(null,mapDispatchToProps)(ObservacionM);