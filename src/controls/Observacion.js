import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Text,Button,Icon,Textarea,Content} from 'native-base'
import {View,Image,Alert, ImageBackground,PermissionsAndroid} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'
import DatePicker from 'react-native-datepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


const optionsPhotos = {
  title: 'Seleccione imagen',
  quality: 0.8,
  maxWidth:420,
  maxHeight:560,
  includeBase64:true
};

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert('¡Atención!','No podrá tomar fotos si no otorga permisos.');
    }
  } catch (err) {
    console.warn(err);
  }
};

class Observacion extends Component {

  state = {
    fecha:"",
    comment:"",
    adjunto:"",
    titulo:"",
    pagina:"",
    tipo:""
  }

  takePhoto = () => {
    launchCamera(optionsPhotos, (response) => {
      if (response.didCancel) {}
      else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
      else if (response.customButton) {}
      else {
        const file = {file:"data:" + response.type + ";base64," + response.base64};
        this.props.setValorControl(this.props.id,this.props.tipo,"adjunto",file);
        this.setState({adjunto:file});
      }
    });
  }

  searchPhoto = () =>{
    launchImageLibrary(optionsPhotos, (response) => {
      if (response.didCancel) {}
        else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
        else if (response.customButton) {}
        else {
          const file = {file:"data:" + response.type + ";base64," + response.base64};
          this.props.setValorControl(this.props.id,this.props.tipo,"adjunto",file);
          this.setState({adjunto:file});
        }
    });
  }

  componentWillMount()
  {
    let titulo        = this.props.configs.filter(row=>row.Nombre === "titulo")[0].Valor;
    let tipo        = this.props.configs.filter(row=>row.Nombre === "tipo")[0].Valor;
    const adjunto     = JSON.parse(this.props.valores.filter(row=>row.Nombre==="adjunto")[0].Valor)
    const comment     = JSON.parse(this.props.valores.filter(row=>row.Nombre==="observacion")[0].Valor)
    const fecha       = JSON.parse(this.props.valores.filter(row=>row.Nombre==="fecha")[0].Valor)

    this.setState({
      adjunto,
      fecha,
      comment,
      titulo,
      tipo
    });
  }

  render() {
    requestCameraPermission();
    return (<View> 
        <Grid style={{borderColor:"grey",borderWidth:1,borderRadius:20,margin:5,padding:10}}>
        <Row style={{justifyContent: 'center'}}>
          <Label style={{marginLeft:10,fontSize:16, color: this.props.theme.primary}}>{this.state.titulo}</Label>
        </Row>
        <Row>
            <View style={{flex:1,flexDirection:'row',marginTop:6, justifyContent: 'center'}}>
              <Button style={{backgroundColor:this.props.theme.tertiary}} small iconLeft  onPress={()=>{
                if(this.state.adjunto === "")
                {
                  this.takePhoto();
                }
                this.setState({pagina:"foto"});
              }}>
                <Icon name='camera' type="FontAwesome" style={{color:this.state.pagina==="foto"?this.props.theme.primary:"white"}}/><Text>+</Text>
              </Button>
              <Button small iconLeft  style={{marginLeft:5,backgroundColor:this.props.theme.tertiary}}onPress={()=>{
                this.searchPhoto();
                this.setState({pagina:"archivo"});
              }}>
                <Icon name='paperclip' type="FontAwesome" style={{color:this.state.pagina==="archivo"?this.props.theme.primary:"white"}}/><Text>+</Text>
              </Button>
              <Button small iconLeft  style={{marginLeft:5,backgroundColor:this.props.theme.tertiary}} onPress={()=>{
                this.setState({pagina:"texto"});
              }}>
                <Icon name='font' type="FontAwesome" style={{color:this.state.pagina==="texto"?this.props.theme.primary:"white"}}/><Text>+</Text>
              </Button>
              {this.state.tipo != 'acta' && (
                <Button small iconLeft  style={{marginLeft:5,backgroundColor:this.props.theme.tertiary}} onPress={()=>{
                  this.refs.datepicker.onPressDate()
                }}>
                  <Icon name='calendar' type="FontAwesome" style={{color:this.state.pagina==="fecha"?this.props.theme.primary:"white"}}/><Text>+</Text>
                </Button>
              )}
            </View>
        </Row>
        <Row> 

          {((this.state.pagina === "foto" || this.state.pagina === "archivo") && this.state.adjunto !== "") &&
          <Grid style={{justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <ImageBackground resizeMode="contain" style={{height:170,width:230,marginTop:20}} source={{uri:this.state.adjunto.file, isStatic:true}}>
              <Row>
                <Col></Col>
                <Col>
                <Button style={{backgroundColor: '#c90000', marginLeft: 16,borderRadius:30, width: 47, height: 47}} block
                  onPress={() => {
                    Alert.alert('Eliminar',
                    '¿Seguro que desea eliminar esta foto?',
                    [
                      {text: 'Cancelar',onPress: () => console.log('Cancel Pressed'),style: 'cancel'},
                      {text: 'OK', onPress: () => {
                        this.setState({adjunto:""});
                      }},
                    ],{cancelable: false},
                    );
                  }}
                  >
                  <Icon type="FontAwesome" name="remove" style={{fontSize:20,color:"#FFFFFF"}} />
                </Button>
                </Col>
              </Row>
              <Row></Row>
              <Row></Row>
            </ImageBackground>
            </View>
          </Grid>
          }

          {this.state.pagina === "texto" &&
            <Content padder>
              <Textarea autoCapitalize='characters' value={this.state.comment} rowSpan={3} bordered placeholder="" onChangeText={(value)=>{
                this.props.setValorControl(this.props.id,this.props.tipo,"observacion",value);
                this.setState({comment:value});
              }} style={{backgroundColor:"transparent", height: '100%', borderRadius: 20, borderColor: this.props.theme.primary}}/>
            </Content>
          }
        </Row>
        </Grid>
        <Grid style={{justifyContent: 'center'}}>
            <DatePicker
            hideText={true}
            ref="datepicker"
            showIcon={false}
            style={{width: 1, height:1 ,backgroundColor:"transparent"}}
            mode="date"
            date={this.state.fecha}
            format="DD-MM-YYYY"
            minDate="01-01-1960"
            maxDate="01-01-2040"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => {
               this.props.setValorControl(this.props.id,this.props.tipo,"fecha",date);
               this.setState({fecha:date})
            }} />
          </Grid>
        {this.props.renderizar(this.props)}</View>
    );
  }
}

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
  }
};

export default connect(null,mapDispatchToProps)(Observacion);