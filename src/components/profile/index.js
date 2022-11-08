
import React, { Component } from 'react';
import {View,Image,ScrollView,FlatList,TouchableOpacity,StyleSheet } from 'react-native';
import { Button as Button2,Body, Text,Label,Item,Input,Spinner,Icon as IconNB,Right,Container,Content } from 'native-base';


import Profile from './Profile'
import Change from './Change'
import Footer from '../footer'

/*
onError
onSuccess
*/

class index extends React.Component {

  state = {
    interface:"Profile",
    message:"",
    profile:null
  }

  loadFrofile()
  {
    const profile = this.props.profilef(this.props.username);
    if(profile === undefined){
      this.setState({profile: 'Not Found'});
    }else{
      this.setState({profile});
    }
  }

  componentDidMount()
  {
    this.props.setBackButton(() => {this.props.go("Menu");});
    this.loadFrofile();
  }

  render() {
    if(this.state.profile===null)
    {
      return (<Spinner/>);
    }
    else
    return ( 
        <Container>
            <View style={{flex:1,flexDirection:"column"}}>
                {this.state.interface==="Profile" &&
                <Profile name={this.state.profile.Nombre} username={this.props.username} theme={this.props.theme} closeSession={this.props.closeSession} changePassword={()=>{this.setState({interface:"Change"});}}/>
                }
                {this.state.interface==="Change" &&
                <Change theme={this.props.theme} 
                onSuccess={()=>{
                    //this.props.onSuccess();
                    this.setState({interface:"Profile",message:""});
                }} 
                onError={(message)=>{this.setState({message})}}
                cancel={()=>{this.setState({interface:"Profile"});}}
                />
                }
            </View>
            {/* <Footer message={this.state.message} color={"grey"}/>     */}
            {this.props.toolbar}
        </Container>
    );
}
}

export default index;