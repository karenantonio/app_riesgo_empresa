import React, { Component } from 'react';
import {
  Button,
  Col,
  Item,
  Label,
  Row,
  Text} from 'native-base';
import { Icon } from 'react-native-elements';
import {View,Alert, ImageBackground, PermissionsAndroid, StyleSheet} from 'react-native'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { connect } from 'react-redux';
import {actionSetValorControl} from '../store/actions'
import {getUID} from '../functions/common';

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

class Foto extends Component {

    state = {
        foto:"",
        fotos:[],
        multimagen:""
    }

    takePhoto = () =>{
      try {
        launchCamera(optionsPhotos, (response) => {
            if (response.didCancel) {}
              else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
              else if (response.customButton) {}
              else {
                const file = {file:"data:" + response.type + ";base64," + response.base64};
                this.props.setValorControl(this.props.id,this.props.tipo,"foto",file);
                this.setState({foto:file});
              }
        });
      } catch (error) {
        console.log(error);
      }
    }

    searchPhoto = () =>{
      launchImageLibrary(optionsPhotos, (response) => {
        if (response.didCancel) {}
        else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
        else if (response.customButton) {}
        else {
          const file = {file:"data:" + response.type + ";base64," + response.base64};
          this.props.setValorControl(this.props.id,this.props.tipo,"foto",file);
          this.setState({foto:file});
        }
      });
    }

    // Métodos multifoto

    takeMultiPhoto = () =>{
      try {
        launchCamera(optionsPhotos, (response) => {
          if (response.didCancel) {}
            else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
            else if (response.customButton) {}
            else {
              const file = {file:"data:" + response.type + ";base64," + response.base64};
              let {fotos} = this.state;
              fotos.push({id:getUID(), imagen:file});
              this.props.setValorControl(this.props.id,this.props.tipo,"fotos",fotos);
              this.setState({foto:file, fotos});
            }
        });
      } catch (error) {
        console.log(error);
      }
    }

    searchMultiPhoto = () =>{
      launchImageLibrary(optionsPhotos, (response) => {
        if (response.didCancel) {}
        else if (response.error) {Alert.alert('ImagePicker Error: ', response.error);}
        else if (response.customButton) {}
        else {
          const file = {file:"data:" + response.type + ";base64," + response.base64};
          let {fotos} = this.state;
          fotos.push({id:getUID(), imagen:file});
          this.props.setValorControl(this.props.id,this.props.tipo,"fotos",fotos);
          this.setState({foto:file, fotos});
        }
      });
    }
  
    deletePhoto = (foto) =>{
      let {fotos} = this.state;
      this.setState({fotos:fotos.filter(larow=>larow.id!==foto.id)}); 
    }

    componentDidMount()
    {
      try {
        const valores = this.props.valores;

        const foto  = JSON.parse(this.props.valores.filter(row=>row.Nombre==="foto")[0].Valor);
        const fotos  = JSON.parse(valores.filter(row=>row.Nombre==="fotos")[0].Valor);

        const multimagen  = this.props.configs.filter(row=>row.Nombre==="multimagen")[0].Valor;
        if(foto !== "")
        {
            this.setState({foto});
        }

        if(fotos !== "")
        {
          this.setState({fotos});
        }

        if(multimagen !== "")
        {
          this.setState({multimagen});
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    eliminar = () =>{
        this.props.setValorControl(this.props.id,this.props.tipo,"foto","");
        this.setState({foto:""});
    }

    render() {
      requestCameraPermission();
    const configs = this.props.configs;
    let titulo = configs.filter(row=>row.Nombre === "titulo")[0].Valor;

    return (
      <View style={styles.container}>
        <Icon name='camera' type='font-awesome' color={this.props.baseColor.Valor} size={50} resizeMode="contain"/>
        <Label>{titulo}</Label>
        {this.state.multimagen !== "True" ? 
          <View style={{flexDirection:this.state.foto === "" ? "column" : "row", justifyContent: 'center'}}>
            {this.state.foto === "" ?
              <Item regular style={styles.botonera}>
                <Button small
                  style={[styles.boton, {backgroundColor: this.props.baseColor.Valor}]} 
                  onPress={()=>{this.takePhoto()}}>
                  <Icon name='camera' type="font-awesome" color={"#FFFFFF"}/>
                  <Text>+</Text>
                </Button>
                <Button small 
                  style={[styles.boton, {backgroundColor: this.props.baseColor.Valor}]}
                  onPress={()=>{this.searchPhoto()}}>
                  <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                  <Text>+</Text>
                </Button>
              </Item>
            :
            <View style={{flexDirection: 'row'}}>
              <ImageBackground resizeMode="contain" style={{height:170,width:230,marginTop:20}} source={{uri:this.state.foto.file, isStatic:true}}>
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
                                      this.eliminar();
                                    }},
                                  ],{cancelable: false},
                                );
                    }}>
                    <Icon type="FontAwesome" name="remove" style={{fontSize:20,color:"#FFFFFF"}} />
                  </Button>
                  </Col>
                </Row>
                <Row></Row>
                <Row></Row>
              </ImageBackground>
            </View>
            }
          </View> 
        : 
          <View style={{alignItems: 'center'}}>
            {this.state.fotos.map(foto => 
              <ImageBackground key={foto.id} resizeMode="contain" style={{height:170,width:230,marginTop:10}} source={{uri:foto.imagen.file, isStatic:true}}>
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
              </ImageBackground>
            )}
            <Item regular style={styles.botonera}>
              <Button small
                style={[styles.boton, {backgroundColor: this.props.baseColor.Valor}]} 
                onPress={()=>{this.takeMultiPhoto()}}>
                <Icon name='camera' type="font-awesome" color={"#FFFFFF"}/>
                <Text>+</Text>
              </Button>
              <Button small 
                style={[styles.boton, {backgroundColor: this.props.baseColor.Valor}]}
                onPress={()=>{this.searchMultiPhoto()}}>
                <Icon name='paperclip' type="font-awesome" color={"#FFFFFF"} />
                <Text>+</Text>
              </Button>
            </Item>   
          </View> 
        }
     {this.props.renderizar(this.props)}</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center'
  },
  botonera: {
    borderColor:'transparent',
    marginTop:10,
    marginBottom:10
  },
  boton: {
    marginLeft: 7,
    marginRight: 7,
    paddingLeft: 20
  }
});

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
  }
};

export default connect(null,mapDispatchToProps)(Foto);