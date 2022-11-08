import React, {Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Button, Body, Text, Label, Item, Input, Spinner} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {Icon} from 'react-native-elements';

/*
onSuccess  
onError
onBack
Auth 
theme
email
username
*/

class Recover extends React.Component {
  state = {
    newPasword: '',
    code: '',
    spinner: false,
    show: true,
    icon_eye: 'eye',
    ok: true,
    message: '',
    success: false,
    data: {}
  };
  recover() {
    if (this.state.code === '' || this.state.newPasword === '') {
      //this.props.onError('Código o contraseña no puede ser vacío.');
      this.setState({message: 'Uno o más campos vacios.', ok: false});
      this.resetMessage();
      return;
    }

    if (this.state.newPasword.length < 6) {
      //this.props.onError('Código o contraseña no puede ser vacío.');
      this.setState({message: 'Contraseña muy corta.', ok: false});
      this.resetMessage();
      return;
    }
    const onError = this.props.onError;
    const Auth = this.props.Auth;

    this.setState({spinner: true});

    Auth.forgotPasswordSubmit(
      this.props.username,
      this.state.code,
      this.state.newPasword,
    )
      .then(data  => {
        this.setState({data: data, success: true})
        //onSuccess(data);
      })
      .catch(err => {
        this.setState({
          spinner: false,
          message: 'Error en código de verificación.',
          ok: false,
        });
        this.resetMessage();
      });
  }

  resetMessage() {
    setTimeout(() => {
      return this.setState({ok: true});
    }, 3500);
  }

  //<Image style={{width:null,height:null,flex:1}} resizeMode="contain" source={require('./images/candado.png')}/>

  render() {
    const theme = this.props.theme;
    return (
      <View>
        {!this.state.success && (
          <View>
            <Grid>
              <Row style={styles.row_info}>
                <Text style={styles.text}>El código fue enviado a:</Text>
              </Row>
              <Row style={styles.row_info}>
                <Text style={styles.text}>{this.props.email}</Text>
              </Row>

              {!this.state.ok && (
                <Row style={styles.row_info}>
                  <Text style={{color: 'red'}}>{this.state.message}</Text>
                </Row>
              )}
            </Grid>

            <Item
              autoCapitalize="none"
              success
              fixedLabel
              style={{marginTop: '9%'}}>
              <Input
                keyboardType="numeric"
                placeholder="Código de Verificación"
                value={this.state.code}
                onChangeText={value => {
                  this.setState({code: value});
                  // console.log(this.state.code);
                }}
              />
            </Item>

            <Item success fixedLabel style={{marginTop: '4%'}}>
              <Input
                placeholder="Nueva Contraseña (min 6 caracteres)"
                secureTextEntry={this.state.show}
                value={this.state.newPasword}
                onChangeText={value => {
                  this.setState({newPasword: value});
                }}
              />
              <Icon
                name={this.state.icon_eye}
                type="font-awesome"
                color="#6E6664"
                onPress={() => {
                  if (this.state.show) {
                    this.setState({show: false});
                    this.setState({icon_eye: 'eye-slash'});
                  } else if (!this.state.show) {
                    this.setState({show: true});
                    this.setState({icon_eye: 'eye'});
                  }
                }}
              />
            </Item>

            <Grid style={{marginTop: '10%'}}>
              <Col>
                <Grid>
                  <Row style={styles.row_info}>
                    {this.state.spinner === true ? (
                      <Spinner color={theme.primary} />
                    ) : (
                      <Button
                        block
                        rounded
                        large
                        style={{backgroundColor: theme.primary}}
                        onPress={() => {
                          this.recover();
                        }}>
                        <Text>Cambiar contraseña</Text>
                      </Button>
                    )}
                  </Row>
                </Grid>
                <Grid style={styles.grid_back}>
                  <Text
                    style={{borderBottomWidth: 1, marginTop: '30%'}}
                    onPress={() => {
                      this.props.onBack();
                    }}>
                    Volver a inicio de Sesión
                  </Text>
                </Grid>
              </Col>
            </Grid>
          </View>
        )}
          {/* view k se despliega despues de cambiar la contarseña conexito */}
        {this.state.success && (
          <View>
            <Grid>
              <Row style={styles.row_info}>
                <Text style={styles.text}>
                  ¡Su contraseña fue cambiada con éxito!
                </Text>
              </Row>
              <Row style={styles.row_info}>
                <Text style={styles.text}>
                  Ahora puede volver a iniciar sesión.
                </Text>
              </Row>
            </Grid>

            <Grid style={{marginTop: '15%'}}>
              <Grid style={{marginBottom: '5%'}}>
                <Row style={styles.row_info}>
                  <Button
                    onPress={() => {
                      const onSuccess = this.props.onSuccess;
                      onSuccess(this.state.data);
                      this.props.onBack();
                    }}
                    block
                    rounded
                    large
                    style={styles.button_ingresar}>
                    <Icon
                      name="arrow-left"
                      type="font-awesome"
                      color="#ffffff"></Icon>
                  </Button>
                </Row>
              </Grid>
            </Grid>
          </View>
        )}
      </View>

      /* <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={{backgroundColor:"#ffffff",margin:20,borderRadius:20,flex:1,padding:20}}>

            <Grid>
                <Row>
                    <Col><Icon name='lock' size={100} type='font-awesome' color={"grey"} /></Col>
                </Row>
            </Grid>

            <Grid>
                <Row>
                    <Col size={9}><Body><Label style={{color:"#333333",textAlign:"center"}}>Fue envida una confirmación a: {this.props.email}</Label></Body></Col>
                </Row>
            </Grid>

            <Item autoCapitalize='none' regular style={{borderColor:"transparent",marginTop:10}}>
                <Input style={{borderRadius:10,borderColor:"#ddd",borderWidth:1,backgroundColor:"#ffffff",color:"#939393"}}
                value={this.state.code}
                onChangeText={(value)=>{this.setState({code:value});}}
                autoFocus={true}
                placeholder={"Código de verificación"}
                placeholderTextColor={"#E7E7E7"}
                />
            </Item>

            <Item autoCapitalize='none' regular style={{borderColor:"transparent",marginTop:10}}>
                <Input style={{borderRadius:10,borderColor:"#cbcbcb",borderWidth:1,backgroundColor:"#ffffff",color:"#939393"}}
                value={this.state.newPasword}
                onChangeText={(value)=>{this.setState({newPasword:value});}}
                placeholder={"Nueva Contraseña (min 6)"}
                placeholderTextColor={"#E7E7E7"}
                />
            </Item>

            {this.state.spinner===true ? <Spinner color={this.props.theme.loadingColor}/> :
            <Button iconLeft block style={{borderRadius:10,marginTop:35,backgroundColor:this.props.theme.commonOkColor}} onPress={()=>{this.recover();}}>
              <Icon type='font-awesome' color={"white"} name='check' /><Text>Cambiar contraseña</Text>
            </Button>
            }

            <Button iconLeft block style={{borderRadius:10,marginTop:15,backgroundColor:this.props.theme.commonCancelColor}} onPress={()=>{this.props.onBack();}}>
              <Icon type='font-awesome' color={"white"} name='window-close' /><Text>Cancelar</Text>
            </Button>

        </View>
        </ScrollView> */
    );
  }
}

const styles = StyleSheet.create({
  row_info: {
    justifyContent: 'center',
    elevation: 0,
    borderBottomWidth: 0,
  },
  text: {
    color: "#32645c",
    fontSize: 20,
  },
  grid_back: {
    justifyContent: 'center',
  },
  button_ingresar: {
    borderRadius: 60,
    width: 100,
    height: 100,
    backgroundColor: "#32645c",
  },
});

export default Recover;
