
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button,Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

class Footer extends React.Component {
  render() {

    let message = this.props.message;

    switch(this.props.message)
    {
      case "LimitExceededException":message="Exede el límite";break;
      case "NotAuthorizedException":message="Los datos no pueden ser validados";break;
      case "NetworkError":message="Error de red";break;
    }

    return ( 
        <Grid>
            <Row>
                <Col>
                    <Label style={{textAlign:"center",color:this.props.color}}>{message}</Label>
                </Col>
            </Row>
        </Grid>
    );
  }
}
export default Footer;