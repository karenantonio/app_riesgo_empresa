import React, { Component } from 'react';
import { Footer, FooterTab,Button,Badge, Title,Text, Content,Body, Left,Right,Input,Item,Label} from 'native-base';
import {Icon} from 'react-native-elements';

/*
onPressHome
onPressDocuments
onPressNotify
onPressProfile
*/

class ToolBar extends React.Component {
  render() {

    
    const selectedColor = this.props.theme.primary;

    return ( 
        <Footer>
        <FooterTab style={{backgroundColor:this.props.theme.toolBackgroundColor}}>
          <Button style={{border:0,backgroundColor:"#FFFFFF"}} 
            active={this.props.interface === "Menu" ? true:false} vertical  onPress={()=>{this.props.onPress(1);}}>
            <Icon active name="home" style={{color:this.props.interface === "Menu" ? selectedColor : "#CCCCCC"}}/>
            <Text style={{color:this.props.interface === "Menu" ? selectedColor : "#CCCCCC"}}>Modulos</Text>
          </Button>
          <Button style={{border:0,backgroundColor:"#FFFFFF"}} 
            active={this.props.interface === "Documents" ? true:false}  vertical onPress={()=>{this.props.onPress(2);}}>
            <Icon type="font-awesome" active name="file"  style={{color:this.props.interface === "Documents" ? selectedColor : "#CCCCCC"}} />
            <Text style={{color:this.props.interface === "Documents" ? selectedColor : "#CCCCCC"}}>Docs</Text>
          </Button>
          <Button style={{border:0,backgroundColor:"#FFFFFF"}} 
            active={this.props.interface === "Search" ? true:false}  vertical onPress={()=>{this.props.onPress(3);}}>
            {/*<Badge style={{backgroundColor:"blue",paddingTop:0}}><Text>2</Text></Badge>*/}
            {/*badge*/}
            <Icon type="FontAwesome" active name="search"  style={{color:this.props.interface === "Search" ? selectedColor : "#CCCCCC"}}/>
            <Text style={{color:this.props.interface === "Search" ? selectedColor : "#CCCCCC"}}>Consulta</Text>
          </Button>
          <Button style={{border:0,backgroundColor:"#FFFFFF"}} 
            active={this.props.interface === "Profile" ? true:false}  vertical onPress={()=>{this.props.onPress(4);}}>
            <Icon active name="person"  style={{color:this.props.interface === "Profile" ? selectedColor : "#CCCCCC"}}/>
            <Text style={{color:this.props.interface === "Profile" ? selectedColor : "#CCCCCC"}}>Perfil</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default ToolBar;