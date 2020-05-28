import React, {Component} from 'react';

import "./SwitchableInputText.css";

export default class SwitchableTextInput extends Component {
    render() {
        return (
            <div data-testid="switchable-text-input" className={this.props.className}>
                <label>{this.props.label}</label>
                {this.props.inputFlag ?
                    <input type="text" className="form-control" value={this.props.value} onChange={(e)=>this.props.onChange(e.target.value)}/> :
                    this.props.value}
            </div>
        );
    }
}
