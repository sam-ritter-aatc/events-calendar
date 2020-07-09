import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import "./DateTimeRange.css";

// moment.locale('en-GB', {
//     week: {
//         dow: 1,
//     }
// });

export default class DateTimeRange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            maxDate: this.props.endDate? new Date(this.props.endDate.setHours(23,59,59)): null,
            minDate: this.props.startDate? new Date(this.props.startDate.setHours(0,0,0)): null,
        }
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeStartTime = this.onChangeStartTime.bind(this);
        this.onChangeEndTime = this.onChangeEndTime.bind(this);
    }

    async onChangeStartDate (date) {
        console.log("Date from component", date);
        await this.setState({
            startDate: new Date(date.setHours(8,0,0)),
            endDate: new Date(date.setHours(20, 0,0)),
            minDate: new Date(date.setHours(0,0,0)),
            maxDate: new Date(date.setHours(23,59,59)),
        });
        console.log("DTR STATE", this.state);
        console.log("CHILD ONCHANGE", date)
        this.props.onChangeStartDate(this.state.startDate);
        this.props.onChangeEndDate(this.state.endDate);
    }

    onChangeStartTime (date) {
        if( this.state.endDate < this.state.startDate) {
            this.setState({
                startDate: date,
                endDate: date
            })
        } else {
            this.setState({startDate: date});
        }
        this.props.onChangeStartDate(this.state.startDate);
        this.props.onChangeEndDate(this.state.endDate);
    }

    onChangeEndTime (date) {
        this.setState({endDate: date})
        this.props.onChangeEndDate(date);
    }

    render() {
        return (
            <div className="dateTimeRangeSelector">
                <div className="dateTimeRangeSelector-date">
                    <label>{this.props.dateLabel}</label>
                    <DatePicker
                        selected={this.props.startDate}
                        placeholderText="Click to select a date"
                        local="en-GB"
                        onChange= {date => this.onChangeStartDate(date)}
                    />
                </div>
                <div className="dateTimeRangeSelector-start">
                    <label>{this.props.startLabel}</label>
                    <DatePicker
                        selected={this.props.startDate}
                        onChange={date => this.props.onChangeStartDate(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        minTime={this.state.minDate}
                        maxTime={this.state.endDate}
                        timeCaption="Start Time"
                        dateFormat="h:mm aa"
                    />

                </div>
                <div className="dateTimeRangeSelector-end">
                    <label>{this.props.endLabel}</label>
                    <DatePicker
                        selected={this.props.endDate}
                        onChange={date => this.onChangeEndTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        minTime={this.state.startDate}
                        maxTime={this.state.maxDate}
                        timeCaption="End Time"
                        dateFormat="h:mm aa"
                    />

                </div>
            </div>
        )
    }
}
