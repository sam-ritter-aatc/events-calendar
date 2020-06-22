import React, {Component} from 'react';

import "./SwitchableInputText.css";
import renderHTML from "react-render-html";

export default class SwitchableTextInput extends Component {
    render() {
        return (
            <div data-testid="switchable-text-input" className={this.props.className}>
                <label>{this.props.label}</label><br/>
                {this.props.displayFlag ?
                    <div>{renderHTML(this.props.value)}</div> :
                    <div></div>}
            </div>
        );
    }
}

// {this.state.event.Details && this.state.event.Details.DescriptionHtml ?
//     <div><h3>Description</h3><div>{renderHTML(this.state.event.Details.DescriptionHtml)}</div></div> :
//     <div></div>}
