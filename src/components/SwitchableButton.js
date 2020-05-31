import React, {Component} from 'react';

import "./SwitchableButton.css";
import {Button} from "reactstrap";

export default class SwitchableButton extends Component {
    render() {
        return <div className='SwitchableButton'>
            {this.props.isVisible && <Button color={this.props.color} onClick={this.props.onClick} disabled={this.props.isDisabled}>{this.props.name}</Button>}
        </div>
    }
}
