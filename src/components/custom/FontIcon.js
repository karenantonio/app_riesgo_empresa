import React, { PureComponent } from 'react';
import { Text } from 'react-native';

export class FontIcon extends PureComponent {
    fontFamily = "";
    icon = "";

    constructor(props) {
        super(props);

        this.fontFamily = props.font.replace(/\.(otf|ttf)$/, '')
        this.icon = String.fromCharCode(props.code);
    }

    render() {
        const {children, color, size, style, ...props} = this.props;

        let extStyle = {
            fontSize: size ?? 22,
            color: color ?? "black"
        }

        let fontStyle = {
            fontFamily: this.fontFamily,
            fontWeight: 'normal',
            fontStyle: 'normal'
        }

        props.style = [style, extStyle, fontStyle]

        return (
            <Text {...props}>
                {this.icon}
                {children}
            </Text>
        );
    }
}