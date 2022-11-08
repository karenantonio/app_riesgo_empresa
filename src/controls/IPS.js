import React, { Component } from 'react';
import { Input, Item, Label, Textarea, Content, Text, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View } from 'react-native';
import { actionSetValorControl } from '../store/actions'
import { connect } from 'react-redux';
import { map } from 'core-js/fn/array';

class IPS extends Component {

    state = {
        data_ips: [],
        filter: null
    };

    componentDidMount() {
        const configs = this.props.configs;

        let nombre_lista = configs.filter(row => row.Nombre === 'lista')[0].Valor;
        let lista = this.props.listas.filter(row => row.Codigo === nombre_lista);
        let data_ips = lista[0].Items || [];

        let filter = null;

        if (configs.filter(row => row.Nombre === 'filter').length > 0) {
            filter = JSON.parse(
                configs.filter(row => row.Nombre === 'filter')[0].Valor,
            );
        }

        this.setState({ data_ips, filter });
    }

    render() {
        function fetchFromObject(obj, prop) {
            //property not found
            if (typeof obj === 'undefined') return false;
            //index of next property split
            var _index = prop.indexOf('.')
            //property split found; recursive call
            if (_index > -1) {
                //get object at property (before split), pass on remainder
                return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
            }
            //no split; get property
            return obj[prop];
        }

        let { data_ips } = this.state;
        let grouped_data_ips = [];

        if (this.state.filter !== null) {
            try {
                let remoteValue = this.props.globalValues.filter(row => {
                    const idregex = new RegExp(
                        `^${this.state.filter.fromId}[A-Z][a-zA-Z0-9]*$`,
                        'ig'
                    );
                    return idregex.test(row.id);
                });
                let areaOp = fetchFromObject(remoteValue[0], this.state.filter.fromKey);

                data_ips.forEach(item => {
                    let exist = false;
                    grouped_data_ips.forEach(grouped_item => {
                        if (grouped_item.texto === item.Texto3) {
                            exist = true;
                            grouped_item.total += 1;
                            if (item[this.state.filter.thisKey].toString() === areaOp.toString())
                                grouped_item.propio += 1;
                        }
                    });
                    if (!exist) {
                        grouped_data_ips.push({
                            texto: item.Texto3,
                            total: 1,
                            propio: item[this.state.filter.thisKey].toString() === areaOp.toString() ? 1 : 0
                        });
                    }
                });

                grouped_data_ips = grouped_data_ips.filter(item => {
                    return item.propio > 0;
                });
            } catch (error) {
                console.log(error);
            }
        }

        return (
            <View>
                {grouped_data_ips.map(item => {
                    return (
                        <Item key={item.texto} regular style={{ borderRadius: 15, padding: 10, margin: 10, backgroundColor: '#e3e2e1' }}>
                            <Grid>
                                <Row>
                                    <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>{'Conducta'}</Text>
                                    <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold', marginLeft: '65%' }}>
                                        {`${item.propio}/${item.total}`}
                                    </Text>
                                </Row>
                                <Row>
                                    <Text style={{ fontSize: 14, color: 'black', marginTop: '1%' }}>
                                        {item.texto}
                                    </Text>
                                </Row>
                            </Grid>
                        </Item>
                    );
                })}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        //listas: state.reducerListas,
        globalValues: state.reducerValores,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setValorControl: (_id, _tipo, _clave, _valor) => { dispatch(actionSetValorControl(_id, _tipo, _clave, _valor)); },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(IPS);