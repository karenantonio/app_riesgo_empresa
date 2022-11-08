
import React, { Component } from 'react';
import {View,Image,ScrollView,FlatList,TouchableOpacity,StyleSheet,Alert } from 'react-native';
import { Button,Body, Text,Label,Item,Input,Spinner,Icon as IconNB,Right,Container,Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {Icon} from 'react-native-elements'
import { Auth } from 'aws-amplify';

class Change extends React.Component {

  state = {
    oldPassword:"",
    newPasword:"",
    spinner:false
  }

  cambiarContraseña(oldPassword,newPasword)
  {
    this.setState({spinner:true});

    Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, oldPassword, newPasword);
    })
    .then(data => {
        this.props.onSuccess();
    })
    .catch(err => {
        this.props.onError(err.code)
        this.setState({spinner:false});
    });
  }

  render() {
    return (
        <View>
  <Label style={{marginLeft:10,marginTop:30}}>Antigua Contraseña</Label>
        <Item regular style={{borderColor:"transparent"}}>
            <Input  autoCapitalize='none' style={{borderRadius:10,borderColor:"#cbcbcb",borderWidth:1,backgroundColor:"#FFFFFF"}}
            value={this.state.oldPassword}
            onChangeText={(value)=>{this.setState({oldPassword:value});}}
            />
        </Item>
        <Label style={{marginLeft:10,marginTop:30}}>Nueva Contraseña (min 6 car.)</Label>
        <Item  autoCapitalize='none' regular style={{borderColor:"transparent"}}>
            <Input style={{borderRadius:10,borderColor:"#cbcbcb",borderWidth:1,backgroundColor:"#FFFFFF"}}
            value={this.state.newPasword}
            onChangeText={(value)=>{this.setState({newPasword:value});}}
            />
        </Item>

        
        {(this.state.oldPassword !== "" && this.state.newPasword !== "") ?
        
        
        
        this.state.spinner === true ? <Spinner color={theme.loadingColor}/> : <Button iconLeft block style={{borderRadius:10,marginTop:35,backgroundColor:this.props.theme.commonOkColor}} onPress={()=>{         
            this.cambiarContraseña(this.state.oldPassword,this.state.newPasword);
        }}><Icon type="FontAwesome" color={"white"} name='check' /><Text>Cambiar contraseña</Text></Button>

        :null

        }
      

        <Button iconLeft block style={{borderRadius:10,marginTop:35,backgroundColor:this.props.theme.commonCancelColor}} onPress={()=>{         
              this.props.cancel();
        }}><Icon type="FontAwesome" color={"white"} name='close' /><Text>Cancelar</Text></Button>



        </View>
    );
}
}

export default Change;