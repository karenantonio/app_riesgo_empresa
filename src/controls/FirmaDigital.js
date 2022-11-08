import React, { Component,PureComponent } from 'react';
import {Input as Input2,Item,Label,Textarea,Content,Body,Icon,Button, Row, Col, Grid} from 'native-base'
import {AppRegistry,StyleSheet,Text,View, TouchableHighlight,Dimensions,Image,Alert, TouchableOpacity} from 'react-native'
import {actionSetValorControl} from '../store/actions'
import { connect } from 'react-redux';
import SignatureCapture from 'react-native-signature-capture';

class FirmaDigital extends React.Component {

  constructor(props) {
    super(props);
    this.refs["sign"] = React.createRef();
    this.marker = 0;
    this.state = state = {
      base64:"",
      editando:false,
      start: true
    };
  }
  

    componentDidMount()
    {
        //Alert.alert("",this.props.valores.filter(row=>row.Nombre==="firma")[0].Valor);

        const valor = JSON.parse(this.props.valores.filter(row=>row.Nombre==="firma")[0].Valor);

        //SET VALORES, LOS VALORES SIEMPRE HAY QUE PARSEARLOS:
        if(valor !== "")
        {
          const base64 = valor.file;
          this.setState({base64});
        }
    }

    resetSign()
    {
      this.refs["sign"].resetImage();
    }

    async _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        const file = {file:"data:image/png;base64," + result.encoded};
        this.props.setValorControl(this.props.id,this.props.tipo,"firma",file);
        this.setState({base64:file.file,editando:false});
    }
    _onDragEvent() {
        // This callback will be called when the user enters signature
    }


    saveLayout() {
      this.view.measureInWindow((x, y, width, height) => {
        Alert.alert("",y.toString());
      });
    }
    

  render() {
    const configs = this.props.configs;
    let titulo  = configs.filter(row=>row.Nombre === "titulo")[0].Valor;
    //let valor   = this.props.valores.filter(row=>row.Nombre==="firma")[0].Valor;
    return (
      <View> 
        <View>
          <Label style={{marginLeft:10,marginTop:20,fontSize:15, color: this.props.baseColor.Valor}}>{titulo}</Label>
          {this.state.start ?
          
          
          <TouchableOpacity style={{...styles.button,padding:0,borderRadius:20}} 
          
         
          
          onPress={()=>{
            
            //this.props.setScroll(100);


            this.setState({start: false});}}>

              <Button iconLeft transparent  onPress={()=>{this.setState({start: false});}}>
                <Icon type="FontAwesome" name="pencil" style={{fontSize:20,color:"#FFFFFF",marginRight:5}} />
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Firmar</Text>
              </Button>

          </TouchableOpacity>


          :
          <Item regular style={{borderColor: this.props.baseColor.Valor, borderRadius: 20}}>
            <View style={{borderRadius: 20, flex: 1}}>

                {this.state.base64 !== "" && this.state.editando === false ? 

                <View>
                <TouchableHighlight onPress={()=>{
                  Alert.alert('Confirmación','¿Desea volver a firmar?. Se borrará la firma actual.',
                    [
                      {text: 'Cancelar',onPress: () => {},style: 'cancel',},
                      {text: 'OK', onPress: () => {this.setState({editando:true})}},
                    ],{cancelable: false},
                  );
                }}><Image style={styles.foto} source={{uri:this.state.base64}}/></TouchableHighlight>
                </View>
                : 
                <View style={{height: 250}}>
                  <View style={{
                    height:200,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                  }}
                  
                  ref={(ref) => { this.marker = ref }}
                  onLayout={({nativeEvent}) => {
                    if (this.marker) {
                      this.marker.measure((x, y, width, height, pageX, pageY) => {
                          this.props.setScroll(pageY);
                       })
                    }
                  }}
                  >
                    {/* <Body style={{borderColor: '#FF0000', borderWidth:1}}> */}
                      <SignatureCapture
                      style={styles.signature}
                      ref="sign"
                      onSaveEvent={async (result)=>{this._onSaveEvent(result);}}
                      onDragEvent={this._onDragEvent}
                      saveImageFileInExtStorage={false}
                      showNativeButtons={false}
                      showTitleLabel={false}
                      viewMode={"portrait"}
                      
                      />
                    {/* </Body> */}
                  </View>
                  <View style={{flexDirection: "row",justifyContent:"center",margin:10 }}>

                      {/* <TouchableHighlight 
                      style={{padding:3,justifyContent:"center"}}>
                          <Button onPress={() => { 
                            Alert.alert('Confirmación','¿Desea cerrar el Contenido?. Se limpiará la firma actual.',
                            [
                              {text: 'Cancelar',onPress: () => {},style: 'cancel',},
                              {text: 'OK', onPress: () => {
                              this.setState({start: true})
                              }},
                            ],{cancelable: false},
                          );
                            }}  style={{backgroundColor: 'black',paddingLeft:2,borderRadius:8,width:160}}>
                            <Icon type="FontAwesome" name="window-close"  style={{flex:1}}/>
                            <Text style={{color:"#ffffff",flex:3}}>Cerrar</Text>
                          </Button>
                      </TouchableHighlight> */}

                      <TouchableHighlight  style={{padding:3,justifyContent:"center",alignSelf:"center"}}>
                        <Button onPress={() => { 
                          Alert.alert('Confirmación','¿Desea volver a firmar?. Se limpiará la firma actual.',
                          [
                            {text: 'Cancelar',onPress: () => {},style: 'cancel',},
                            {text: 'OK', onPress: () => {
                            this.resetSign();
                            }},
                          ],{cancelable: false},
                        );
                        } } style={{backgroundColor:"#c90000",paddingLeft:2,borderRadius:8,width:160}}>
                          <Icon type="FontAwesome" name="eraser" style={{flex:1}}/>
                          <Text style={{color:"#ffffff",flex:3}}>Limpiar</Text>
                        </Button>
                      </TouchableHighlight>


                      <TouchableHighlight 
                      style={{padding:3,justifyContent:"center"}}>
                          <Button onPress={() => { this.refs["sign"].saveImage();  } }  style={{backgroundColor: '#00c92f',paddingLeft:2,borderRadius:8,width:160}}>
                            <Icon type="FontAwesome" name="check"  style={{flex:1}}/>
                            <Text style={{color:"#ffffff",flex:3}}>Confirmar</Text>
                          </Button>
                      </TouchableHighlight>
                  </View>
                </View>
                }

            </View>
          </Item>}
      </View>
      {this.props.renderizar(this.props)}</View>
    );
  }
}

{/* <View> 
        <View>
          <Label style={{marginLeft:10,marginTop:20,fontSize:14}}>{titulo}</Label>
          {this.state.start ?
          
          
          <TouchableOpacity style={{...styles.button,padding:0,borderRadius:8}} 
          
         
          
          onPress={()=>{


            this.setState({start: false});}}>

              <Button iconLeft transparent  onPress={()=>{this.setState({start: false});}}>
                <Icon type="FontAwesome" name="pencil" style={{fontSize:20,color:"#FFFFFF",marginRight:5}} />
                <Text style={{ color: '#FFF', fontSize: 14 }}>Firmar</Text>
              </Button>

          </TouchableOpacity>


          :
          <Item regular style={{borderColor:"transparent"}}>
            <View style={{borderColor:"#cbcbcb",borderWidth:1, flex: 1}}>

                {this.state.base64 !== "" && this.state.editando === false ? 

                <View>
                <TouchableHighlight onPress={()=>{
                  Alert.alert('Confirmación','Desea volver a firmar?. Se borrará la firma actual.',
                    [
                      {text: 'Cancel',onPress: () => {},style: 'cancel',},
                      {text: 'OK', onPress: () => {this.setState({editando:true})}},
                    ],{cancelable: false},
                  );
                }}><Image style={styles.foto} source={{uri:this.state.base64}}/></TouchableHighlight>
                </View>
                : 
                <View style={{height: 250}}>
                  <View style={{
                    height:200,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                  }}
                  
                  ref={(ref) => { this.marker = ref }}
                  onLayout={({nativeEvent}) => {
                    if (this.marker) {
                      this.marker.measure((x, y, width, height, pageX, pageY) => {
                          this.props.setScroll(pageY);
                       })
                    }
                  }}
                  >
                  
                      <SignatureCapture
                      style={styles.signature}
                      ref="sign"
                      onSaveEvent={async (result)=>{this._onSaveEvent(result);}}
                      onDragEvent={this._onDragEvent}
                      saveImageFileInExtStorage={false}
                      showNativeButtons={false}
                      showTitleLabel={false}
                      viewMode={"portrait"}
                      
                      />
                    
                  </View>
                  <View style={{flexDirection: "row",justifyContent:"center",margin:10 }}>

                    
                      <TouchableHighlight  style={{padding:3,justifyContent:"center",alignSelf:"center"}}>
                        <Button onPress={() => { 
                          Alert.alert('Confirmación','Desea volver a firmar?. Se borrará la firma actual.',
                          [
                            {text: 'Cancel',onPress: () => {},style: 'cancel',},
                            {text: 'OK', onPress: () => {
                            this.resetSign();
                            }},
                          ],{cancelable: false},
                        );
                        } } iconLeft   style={{backgroundColor:"#ff4344",paddingLeft:5,borderRadius:8,width:130}}>
                          <Icon type="FontAwesome" name="trash" style={{flex:1}}/>
                          <Text style={{color:"#ffffff",flex:4}}>Borrar</Text>
                        </Button>
                      </TouchableHighlight>


                      <TouchableHighlight 
                      style={{padding:3,justifyContent:"center",alignSelf:"center"}}>
                          <Button onPress={() => { this.refs["sign"].saveImage();  } } iconLeft  style={{backgroundColor:this.props.theme.commonOkColor,paddingLeft:5,borderRadius:8,width:180}}>
                            <Icon type="FontAwesome" name="check"  style={{flex:1}}/>
                            <Text style={{color:"#ffffff",flex:6}}>Confirmar</Text>
                          </Button>
                      </TouchableHighlight>
                  </View>
                </View>
                }

            </View>
          </Item>}
      </View>
      {this.props.renderizar(this.props)}</View> */}

const styles = StyleSheet.create({
    signature: {
        borderColor: '#cbcbcb',
        borderWidth: 1,
        flex:1,
        height:200,
    },
    foto:{
      width:Dimensions.get('window').width-40,
      height:200,
      marginRight:10
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
    button: {
      backgroundColor: '#32645c',
      alignItems: 'center',
      flex: 1,
      padding: 12,
      marginTop: 8,
      marginLeft: 1,
      marginRight: 1
    },
});

const mapDispatchToProps = (dispatch,ownProps) => {
  return {
    setValorControl:(_id,_tipo,_clave,_valor)=>{dispatch(actionSetValorControl(_id,_tipo,_clave,_valor));},
  }
};

export default connect(null,mapDispatchToProps)(FirmaDigital);