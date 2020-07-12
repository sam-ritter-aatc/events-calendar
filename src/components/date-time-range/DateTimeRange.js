import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "./DateTimeRange.css";
import enGB from "date-fns/locale/en-GB";
registerLocale("en-GB", enGB);

setDefaultLocale("en-GB")

export default class DateTimeRange extends Component {
    constructor(props) {
        super(props);

        console.log("PROPS", props);
        this.state = {
            startDate: new Date(this.props.startDate.getTime()),
            endDate: new Date(this.props.endDate.getTime()),
            maxDate: this.props.endDate? new Date(new Date(this.props.endDate.getTime()).setHours(23,59,59)): null,
            minDate: this.props.startDate? new Date(new Date(this.props.startDate.getTime()).setHours(0,0,0)): null,
        }
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeStartTime = this.onChangeStartTime.bind(this);
        this.onChangeEndTime = this.onChangeEndTime.bind(this);
    }

    async onChangeStartDate (date) {
        let newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
        console.log("Date from component", date, newDate);
        await this.setState({
            startDate: newDate,
            endDate: new Date(this.state.endDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())),
            minDate: new Date(date.setHours(0,0,0)),
            maxDate: new Date(date.setHours(23,59,59)),
        });
        console.log("DTR STATE", this.state);
        console.log("CHILD ONCHANGE", date)
        this.props.onChangeStartDate(this.state.startDate);
        this.props.onChangeEndDate(this.state.endDate);
    }

    async onChangeStartTime (date) {
        if( this.state.endDate < this.state.startDate) {
            await this.setState({
                startDate: date,
                endDate: date
            })
        } else {
            await this.setState({startDate: date});
        }
        this.props.onChangeStartDate(this.state.startDate);
        this.props.onChangeEndDate(this.state.endDate);
        console.log("State after start time change", this.state);
    }

    onChangeEndTime (date) {
        this.setState({endDate: date})
        this.props.onChangeEndDate(date);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if( this.state.startDate !== prevState.startDate || this.state.endDate !== prevState.endDate) {
            this.render();
        }
    }

    render() {
        return this.renderComponent();
    }

    renderComponent() {
        return (
            <div className="dateTimeRangeSelector">
                <div className="dateTimeRangeSelector-date">
                    <label>{this.props.dateLabel}</label>
                    <DatePicker
                        selected={this.props.startDate}
                        placeholderText="Click to select a date"
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
