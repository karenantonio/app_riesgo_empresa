
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button,Label,Content,Card,Text,Body,CardItem,Spinner } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

class Log extends React.Component {
  render() {
    return ( 
      <Content style={{paddingLeft:10,paddingBottom:20,paddingRight:10,paddingTop:10}}>
        {this.props.message.map((log,key)=>{
          return(
          <Card key={key}>
          <CardItem>
            <Body>
              <Text>
              {log.log}
              </Text>
            </Body>
          </CardItem>
          </Card>)
        })
        }
        <Spinner/>
      </Content>
    );
  }
}
export default Log;

/*
 <CardItem header>
          <Text>{log.title}</Text>
          </CardItem>*/