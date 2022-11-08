import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import {
    Container,
    Content,
    Header,
    Item,
    Spinner,
    Text,
    Textarea,
    View
} from 'native-base';
import Footer from './Footer';
import FormRenderer from './FormRenderer';

class Formulario extends React.Component {
    state = {
        bgcolor: {},
        loading: false
    }

    componentDidMount() {
        this.setState({bgcolor: {
            backgroundColor: this.props.doc.Tag[0].Valor
        }});
    }

    render() {
        if (this.state.loading)
            return(
                <Spinner color="blue"/>
            );
        else
            return (
                <Container style={styles.container}>
                    <Header style={[styles.header, this.state.bgcolor]}>
                        <Text style={styles.headerTitle}>{this.props.doc.Title}</Text>
                    </Header>
                    <FormRenderer style={styles.content}/>
                    <Footer
                        doc={this.props.doc}
                        readOnly={this.props.readOnly}
                        setInterface={this.props.setInterface}
                        theme={this.props.theme}/>
                </Container>
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column"
    },
    header: {
        borderBottomWidth:0,
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
    },
    headerTitle: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        textAlignVertical: "center"
    },
    content: {
        flex: 1
    }
})

export default connect()(Formulario);