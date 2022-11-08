
import React, { Component } from 'react';
import {View} from 'react-native';
import { Button as Button2, Text,Icon as IconNB,Right } from 'native-base';

/*
Title
*/

class Button extends React.Component {

  state = {
  }

  //this.props.theme.menuBackGroundOff
  //this.props.theme.menuColorOff

  render() {
      return(
        <View style={{marginLeft:20,marginRight:20}}>
           <Button2 full onPress={()=>{this.props.onPress();}}
            style={{borderRadius:10,backgroundColor:"red",marginTop:5,borderWidth:1,borderColor:"#cbcbcb"}}>
                <Text style={{color:"red"}}>{this.props.Title}</Text>
            </Button2>
        </View>       
      );
   
  }
}

export default Button;