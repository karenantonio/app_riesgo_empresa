import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Textarea,Content,Icon,Left,Body,Right,Button} from 'native-base'
import {AppRegistry,StyleSheet,Text,View, TouchableHighlight,Platform,TouchableOpacity,Dimensions,PermissionsAndroid,Alert,Modal } from 'react-native'
import {actionSetValorControl} from '../store/actions'
import { connect } from 'react-redux';
import { CameraKitCameraScreen } from 'react-native-camera-kit';

class CodigoQR extends React.Component {

  state = {
    valor_con_formato: '',   
    start: false,
    visualizador:null,
    validador:null
  }

  open=async ()=> {
    let that = this;
    if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA, {
            'title': 'Permiso necesario para continuar',
            'message': 'Necesitamos acceso a la cámara'
            });
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({start: true });
          } else {
            Alert.alert("CAMERA permission denied");
          }
        } catch (err) {
          Alert.alert("Camera permission err", err);
        }
    } else {
      that.setState({start: true });
    }
    }


    makeFunction(text) {
      let that = this;
      return eval(text);
    }

    componentDidMount()
    {
        let that = this;
        const configs = this.props.configs;
        const valores = this.props.valores;

        //Alert.alert("",JSON.stringify(valores));

        //VALOR GUARDADO
        const texto = JSON.parse(valores.filter(row=>row.Nombre==="texto")[0].Valor); //CODIGO TAL CUAL
        const valor = JSON.parse(valores.filter(row=>row.Nombre==="valor")[0].Valor); //CODIGO FILTRADO POR FUNCION DE VALIDADO

        // const funcionprea1 = "function (code){let estado = true;let resultado = '';/*POSIBLE CARNET VIEJO*/try{var substring = code.substr(0,9);if (/^([0-9])*$/.test(substring)){resultado = substring;estado = true;}else{estado = false;resultado = '';}}catch(err){estado = false;resultado = '';}/*SI NO ES CARNET VIEJO, EVALUAR NUEVO*/if(estado === false)try{var sp = code.split('RUN=');if(sp.length>0){var sp2 = sp[1].split('&');var r = sp2[0];resultado = r.replace('-','');estado = true;}else{estado = false;resultado = '';}}catch(err){estado = false;resultado = '';}/*RESULTADO*/if(estado){return that.getObjectForSubTitle('trabajadores',resultado);}else{return false;}}";
        // const funcionprea2 = "function (code){let estado = true;let resultado = '';/*POSIBLE CARNET VIEJO*/try{var substring = code.substr(0,9);if (/^([0-9])*$/.test(substring)){resultado = substring;estado = true;}else{estado = false;resultado = '';}}catch(err){estado = false;resultado = '';}/*SI NO ES CARNET VIEJO, EVALUAR NUEVO*/if(estado === false)try{var sp = code.split('RUN=');if(sp.length>0){var sp2 = sp[1].split('&');var r = sp2[0];resultado = r.replace('-','');estado = true;}else{estado = false;resultado = '';}}catch(err){estado = false;resultado = '';}/*RESULTADO*/if(estado){var visor = that.getObjectForSubTitle('trabajadores',resultado);return visor.Titulo + ' (' + visor.SubTitulo + ')';}else{return false;}}";

        //PARAMETROS DE CONFIGURACION:
        const validador     = "(" + configs.filter(row=>row.Nombre === "validador")[0].Valor + ")";     //configs.filter(row=>row.Nombre === "validador")[0].Valor
        const visualizador  = "(" + configs.filter(row=>row.Nombre === "visualizador")[0].Valor + ")";  //configs.filter(row=>row.Nombre === "visualizador")[0].Valor
    
        const formato =  this.makeFunction(visualizador);
        //Alert.alert("",f("test!123456789"));

        this.setState({valor_con_formato:formato(texto),validador,visualizador});
    }

    //function (code){let estado = true;let resultado = '';/*POSIBLE CARNET VIEJO*/try{var substring = code.substr(0,9);if (/^([0-9])*$/.test(substring)){resultado = substring;estado = true;}else{estado = false;resultado = '';}}catch(err){estado = false;resultado = '';}/*SI NO ES CARNET VIEJO, EVALUAR NUEVO*/if(estado === false)try{var sp = code.split('RUN=');if(sp.length>0){var sp2 = sp[1].split('&');var r = sp2[0];resultado = r.replace('-','');estado = true;}else{estado = false;resultado = '';}}catch(err){estado = false;resultado = '';}/*RESULTADO*/if(estado){return resultado;}else{return false;}}

    //LLEGA COMO PARAMETRO EL RUT CON DIGITO VERIFICADOR Y SIN GUION y EL CODIGO DE LISTA A UTILIZAR
    getObjectForSubTitle = (_list,_rut) => 
    {
      let lista = this.props.listas.filter(row => row.Codigo === _list);
      let data  = lista[0].Items || [];

      const filtro = data.filter(row=>{
          if(row.SubTitulo.replace("-","") === _rut)
          {
            return true;
          }
          else
          {
            return false;
          }
        });
      if(filtro.length>0)
      {
        return filtro[0];
      }
      else
      {
        // return {Titulo: "", SubTitulo: _rut, Span: ""};
        return null;
      }
    }
  
    done = (e) => {
      //172161081100457169 CARO
      //https://portal.sidiv.registrocivil.cl/docstatus?RUN=16982207-7&type=CEDULA&serial=512397547&mrz=512397547988050722805070
      let that = this;
      const texto = e.nativeEvent.codeStringValue;
      const visorFunction = this.makeFunction(this.state.visualizador);
      const validFunction = this.makeFunction(this.state.validador);

      //const obj = that.getObjectForSubTitle("trabajadores","161866105");
      //Alert.alert("",JSON.stringify(obj));
      
      const valor = validFunction(texto);

      if(valor !== false)
      {
        const valor_text  = visorFunction(texto);
        this.props.setValorControl(this.props.id,this.props.tipo,"texto",texto);
        this.props.setValorControl(this.props.id,this.props.tipo,"valor",valor);
        this.setState({ valor_con_formato:valor_text,start: false });
      }
      else
      {
        Alert.alert("Código no válido","Se ha ingresado un codigo que no es válido.");
      }
    }

    render() {
    const configs = this.props.configs;
    let titulo    = configs.filter(row=>row.Nombre === "titulo")[0].Valor;

    const styles = StyleSheet.create({
      MainContainer: {
        flex: 1,
        paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      QR_text: {
        color: '#000',
        fontSize: 19,
        padding: 8,
        marginTop: 12
      },
      button: {
        backgroundColor:this.props.this.props.theme.commonOkColor,
        alignItems: 'center',
        flex: 1,
        padding: 12,
        marginTop: 8,
        marginLeft: 1,
        marginRight: 1
      },
      cameraButton: {
        backgroundColor: this.props.this.props.theme.commonOkColor,
        alignItems: 'center',
        padding: 12
      }
    });

    if (!this.state.start) {
      if (this.state.valor_con_formato == '') {
        return (<View>
          <View>
            <Label style={{marginLeft:10,marginTop:20,fontSize:14}}>{titulo}</Label>

            <TouchableOpacity onPress={this.open} style={{...styles.button,borderRadius:8,padding:0}}>
              <Button iconLeft transparent  onPress={this.open}>
                <Icon type="FontAwesome" name="qrcode" style={{fontSize:20,color:"#FFFFFF",marginRight:5}} />
                <Text style={{ color: '#FFF', fontSize: 14 }}>Escanear Código</Text>
              </Button>
            </TouchableOpacity> 

          </View>
          {this.props.renderizar(this.props)}</View>
        );
      }
      else {
        return (<View>
          <View>
            <Label style={{marginLeft:10,marginTop:20,fontSize:14}}>{titulo}</Label>

            <View style={{borderWidth:1,borderColor:"#cbcbcb"}}>
              <Text style={styles.QR_text}>
                {this.state.valor_con_formato}
              </Text>
            </View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'stretch',
              }}>
              <TouchableOpacity onPress={()=> {
                this.setState({valor_con_formato: ''});
              }} style={styles.button}>
                <Text style={{ color: '#FFF', fontSize: 14 }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.open} style={styles.button}>
                <Text style={{ color: '#FFF', fontSize: 14 }}>
                  Volver a Escanear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.props.renderizar(this.props)}</View>
        );
      }
    }
    return (<View> 
      <Modal animationType={'slide'}>
        <CameraKitCameraScreen
          ref={cam => this.camera = cam}
          showFrame={true}
          scanBarcode={true}
          laserColor={'red'}
          frameColor={'green'}
          colorForScannerFrame={'black'}
          
          onReadCode={event =>
            this.done(event)
          }
          hideControls={true}
        />
        <TouchableOpacity onPress={()=>{
          this.setState({start:false});
        }} style={styles.cameraButton}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>
              Cancelar
            </Text>
          </TouchableOpacity>
      </Modal>
      {this.props.renderizar(this.props)}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      listas:state.reducerListas,
  }
};
const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(CodigoQR);