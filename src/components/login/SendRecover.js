import React, {Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Button, Body, Text, Label, Item, Input, Spinner} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {Icon} from 'react-native-elements';

/*
onSuccess(username)
onError
onBack
Auth 
theme
*/

class SendRecover extends React.Component {
  state = {
    username: '',
    error: '',
    spinner: false,
    message: '',
    ok: true,
  };

  send() {
    if (this.state.username === '') {
      //this.props.onError('Usuario no puede ser vacio.');
      this.resetMessage();
      this.setState({message: 'El campo no puede estar vacio.', ok: false});
      return;
    }

    const onSuccess = this.props.onSuccess;
    const onError = this.props.onError;
    const Auth = this.props.Auth;

    this.setState({spinner: true});

    Auth.forgotPassword(this.state.username)
      .then(data => {
        onSuccess(this.state.username, data.CodeDeliveryDetails.Destination);
      })
      .catch(err => {
        //onError(err.code);
        this.resetMessage();
        this.setState({
          message: 'No se pudo encontar el Usuario.',
          ok: false,
          spinner: false,
        });
      });
  }

  resetMessage() {
    setTimeout(() => {
      return this.setState({ok: true});
    }, 3500);
  }

  //<Image style={{width:100,height:100,flex:1}} resizeMode="contain" source={require('./images/candado.png')}/>

  render() {
    const theme = this.props.theme;
    return (
      <View>
        {this.state.ok ? (
          <Grid>
            <Row style={styles.row_info}>
              <Text style={{color: theme.primary}}>
                Escriba su Correo y se le enviará
              </Text>
            </Row>
            <Row style={styles.row_info}>
              <Text style={{color: theme.primary}}>un código de verificación.</Text>
            </Row>
          </Grid>
        ) : (
          <Grid>
            <Row style={styles.row_info}>
              <Text style={{color: 'red'}}>{this.state.message}</Text>
            </Row>
            <Row style={styles.row_info}>
              <Text style={{color: 'red'}}>
                Por favor, vuelva a Intentarlo.
              </Text>
            </Row>
          </Grid>
        )}

        <Item success fixedLabel style={{marginTop: '9%'}}>
          <Input
            placeholder="Correo"
            autoCapitalize="none"
            onChangeText={value => {
              this.setState({username: value});
              //console.log(this.state.username);
            }}
            value={this.state.username}
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
                    style={styles.button_next}
                    onPress={() => {
                      this.send();
                    }}>
                    <Icon
                      name="arrow-right"
                      type="font-awesome"
                      color="#ffffff"></Icon>
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
      /*  <ScrollView keyboardShouldPersistTaps={'handled'}>
        <Grid>
            <Row>
            <Col>
            <View style={{backgroundColor:"#ffffff",margin:20,borderRadius:20,flex:1,padding:20}}>
            <Grid>
              <Row size={3}><Col>
                <Grid>
                    <Row>
                      <Col>
                        <Body><Icon name='lock' size={100} type='font-awesome' color={"grey"} /></Body>
                      </Col>
                    </Row>
                </Grid>
              </Col></Row>

              <Row size={1}><Col>
              <Grid style={{marginTop:10}}>
                  <Row>
                    <Col size={1} style={{paddingLeft:10}}><Icon type='font-awesome' color={"#D4D4D4"} name="user" /></Col>
                    <Col size={9}><Label style={{color:this.props.theme.loginLabelColor,fontSize:16,marginLeft:5}}>Rut (sin guión)</Label></Col>
                  </Row>
              </Grid>
              </Col></Row>

              <Row size={2}><Col>
              <Grid>
              <Row>
                <Col>
                  <Item regular style={{borderColor:"transparent",marginTop:5}}>
                  <Input style={{paddingBottom:0,paddingTop:0}} autoCapitalize='none' onChangeText={(value)=>{
                    this.setState({username:value});
                  }} placeholder='' style={{backgroundColor:"#ffffff",borderRadius:10,borderColor: '#ddd',borderWidth: 1,color:"#939393"}}
                  value={this.state.username}
                  />
                  </Item>
                </Col>
              </Row>
              </Grid>
              </Col></Row>

              <Row size={4}><Col>
              <Grid>
              <Row>
                <Col>
                {this.state.spinner===true ? <Spinner color={this.props.theme.loadingColor}/> :
                <Button iconLeft block style={{borderRadius:10,marginTop:35,backgroundColor:this.props.theme.commonOkColor}} onPress={()=>{this.send();}}>
                  <Icon type='font-awesome' color={"white"} name='check' /><Text style={{fontSize:12}}>Enviar código de verificación</Text>
                </Button>
                }
                <Button iconLeft block style={{borderRadius:10,marginTop:15,backgroundColor:this.props.theme.commonCancelColor}} onPress={()=>{this.props.onBack();}}>
                  <Icon type='font-awesome' color={"white"} name='window-close' /><Text style={{fontSize:12}}>Cancelar</Text>
                </Button>
                </Col>
              </Row>
              </Grid>
              </Col>
              </Row>

            </Grid>
            </View>
            </Col>
            </Row>
        </Grid>
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
  button_next: {
    borderRadius: 60,
    width: 100,
    height: 100,
    backgroundColor: "#32645c",
  },
  grid_back: {
    justifyContent: 'center',
  },
});

export default SendRecover;

/*
<Row>
                    <Col>
                      {this.state.error !== "" &&
                      <View style={{flexDirection:'row',flex:1,justifyContent: 'center',marginTop:35}}>
                        <Text style={{color:"red"}}>{this.state.error}</Text>
                        <Icon style={{marginLeft:10,color:"red"}} name='checkmark-circle' />
                      </View>
                      }
                    </Col>
              </Row>
*/
