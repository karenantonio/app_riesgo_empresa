
import React, { Component } from 'react';
import {View} from 'react-native';
import { Button, Text,Icon as IconNB,Right } from 'native-base';

/*
Title
Open
*/

class Menu extends React.Component {

  state = {
  }


//this.props.theme.menuColorOn

  render() {
      return(
        <View style={{marginLeft:20,marginRight:20}}>
            <Button full  iconRight style={{backgroundColor:this.props.theme.menuBackGroundOn,borderRadius:10,marginTop:5}} onPress={()=>{this.props.onPress();}}>
                <Text style={{color:"red"}}>{this.props.Title}</Text>
                {this.props.Open ?
                <Right style={{paddingRight:20}}><IconNB style={{color:"red"}} type="FontAwesome" name='chevron-down' /></Right>
                :
                <Right style={{paddingRight:20}}><IconNB style={{color:"red"}} type="FontAwesome" name='chevron-up' /></Right>
                }
            </Button>
        </View>       
      );
   
  }
}

export default Menu;