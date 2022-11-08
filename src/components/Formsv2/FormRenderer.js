import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Text } from 'native-base';

class FormRenderer extends React.Component {
    render() {
        return (
            <Content></Content>
        );
    }
}

export default connect()(FormRenderer);