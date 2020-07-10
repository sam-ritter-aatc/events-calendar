import React, {Component} from 'react';
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {getAuthTokens} from "../../utils/WildApricotOAuthUtils";
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {createEvent} from "../../utils/WildApricotEvents";
import {emptyEvent} from "../EventCommon";
import "./EventCreator.css";
import DateTimeRange from "../date-time-range/DateTimeRange";

export default class EventCreator extends Component {
    constructor(props) {
        super(props);
        console.log("INCOMING PROPS", props);

        this.state = {
            event: emptyEvent(),
            isEditing: true,
            eventInfo: props.location.state.eventInfo,
            member: props.location.state.member,
            fetch: true
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEventLocation = this.onChangeEventLocation.bind(this);
        this.onChangeEventName = this.onChangeEventName.bind(this);
        this.startDateHandler = this.startDateHandler.bind(this);
        this.endDateHandler = this.endDateHandler.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        let theEvent = Object.assign({}, this.state.event);
        theEvent.StartDate = theEvent.StartDate.toISOString();
        theEvent.EndDate = theEvent.EndDate.toISOString();
        console.log("SAVING EVENT", this.state, theEvent);
        createEvent(this.state.waToken, theEvent, (data) => {console.log("CREATE RESULT", data)});

        this.setState({event: emptyEvent()});
    }

    onChangeEventName(e) {
        this.setState({event: {...this.state.event, Name: e.target.value }})
    }

    onChangeEventLocation(e) {
        this.setState({event:{...this.state.event, Location: e.target.value}})
    }

    async componentDidMount() {
        await getAuthTokens((data) => this.setState({waToken: data}));
        console.log("EVENT DETAILS", this.props.location.state);
        this.setState({
            member: this.props.location.state.member,
            eventInfo: this.props.location.state.eventInfo
        })

        console.log("STATE",this.state);
        if (this.state.eventInfo.date) {  // user clicked on a date to create event.
            this.setState({event: {...this.state.event, StartDate: new  Date(this.state.eventInfo.date)}})
            this.setState({event: {...this.state.event, EndDate: new  Date(this.state.eventInfo.date)}})
        }
        this.setState({fetch:false});
        console.log('===>state', this.state);

        if (this.props.location.state.eventInfo.date) {
            let maxTime = new Date(this.props.location.state.eventInfo.date.getTime());
            this.setState({event: {...this.state.event, startDate: this.props.location.state.eventInfo.date}});
            this.setState({event: {...this.state.event, endDate: new Date(maxTime.setHours(23,59,59))}});
        }
        let details = Object.assign({}, this.state.event.Details)
         details.Organizer = {
            Id: this.state.member.id
        }
        this.setState({event: {...this.state.event, Details:details}});
        console.log("state", this.state);
    }

    startDateHandler(date) {
        console.log("CreatorState", this.state);
        this.setState({event: {...this.state.event, StartDate: date}});
    }

    endDateHandler(date) {
        console.log("CreatorState", this.state);
        this.setState({event: {...this.state.event, EndDate: date}});
    }

    render() {
        if (this.state.fetch) {
            return <EventDataLoader name={this.props.location.state.name}/>;
        } else {
            return (
                <div className="App">
                     <div className="editor">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Event Name: </label>
                                <input type="text"
                                        className="form-control"
                                        value={this.state.event.Name}
                                        onChange={this.onChangeEventName}/>
                            </div>
                            <div className="form-group">
                                <DateTimeRange dateLabel="Event Date: "
                                               startLabel="Start Time: "
                                               endLabel="End Time: "
                                               startDate={this.state.event.StartDate}
                                               endDate={this.state.event.EndDate}
                                               onChangeStartDate={this.startDateHandler}
                                               onChangeEndDate={this.endDateHandler}/>
                            </div>
                            <div className="form-group">
                                <label>Event Location: </label>
                                <input type="text"
                                        className="form-control"
                                        value={this.state.event.Location}
                                        onChange={this.onChangeEventLocation}/>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <CKEditor
                                    editor={ ClassicEditor }
                                    data={this.state.event.Details.DescriptionHtml}
                                    onChange={ ( event, editor ) => {
                                        let details = this.state.event.Details;
                                        details.DescriptionHtml = editor.getData();
                                        this.setState({event: {...this.state.event, Details: details}});
                                    } }
                                />
                            </div>

                            <div className="form-group">
                                <input type="submit" value="Save Event" className="btn btn-primary" />
                            </div>

                        </form>
                    </div>
                </div>
            )
        }
    }
}

