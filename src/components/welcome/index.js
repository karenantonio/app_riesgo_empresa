import React, { Component } from 'react';
import { Footer, FooterTab,Button,Badge, Title,Text, Content,Body, Icon, Left,Right,Input,Item,Label,Spinner, Container} from 'native-base';
import theme from '../../project/theme'
import {View,Image} from 'react-native'


class Welcome extends React.Component {
  state = {
    show:true
  }


  componentDidMount()
  {
    window.setTimeout(()=>{this.setState({show:false});},1000);
  }

  render() {
    return ( 
      <View style={{flex: 1,justifyContent : 'center',alignItems: 'center'}}>
        {/* <Image style={{width:200}} resizeMode="contain" source={require('../../project/images/cmpc.png')}/> */}
      </View>
    );
  }
}

{/* <View style={{flex: 1,justifyContent : 'center',alignItems: 'center'}}>
{this.state.show === false ? 
<Image style={{width:200}} resizeMode="contain" source={require('../../project/images/cmpc.png')}/>
:
<Label style={{color:theme.loadingColor,fontSize:16,fontFamily:"inherit",textAlign:"center"}}>BIENVENIDO</Label>
}
</View> */}

//

export default Welcome;