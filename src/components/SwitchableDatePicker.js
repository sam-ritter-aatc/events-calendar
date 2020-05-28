import React, {Component} from 'react';

import "./SwitchableDatePicker.css";
import DatePicker from "react-datepicker";

export default class SwitchableDatePicker extends Component {
    render() {
        return (
            <div className="form-group">
                <label>{this.props.label}</label>
                {!this.props.editFlag ? this.props.selected.toLocaleString() :
                <DatePicker
                    className="endDateEntry"
                    selected={this.props.selected}
                    onChange={this.props.handleChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMM d, yyyy h:mm aa"
                    startDate={this.props.start}
                    endDate={this.props.end}
                    minDate={this.props.minDate}
                />
                }
            </div>
        );

    }
}