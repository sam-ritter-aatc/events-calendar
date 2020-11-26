import React, {Component} from 'react';
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {getEventById, updateEvent, deleteEvent} from "../../utils/WildApricotEvents";
import {getContact} from "../../utils/WildApricotContacts";
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {emptyEvent, searchForSessionAndAdjustFields} from "../EventCommon";
import DateTimeRange from "../date-time-range/DateTimeRange";
import {Button} from "react-bootstrap-buttons";

import "./EventEditor.css";

const editorConfiguration = {
    link: {
        link: {
            decorators: {
                addTargetToExternalLinks: {
                    mode: 'automatic',
                    callback: url => /^(https?:)?\/\//.test( url ),
                    attributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer'
                    }
                }
            }
        }
    }
};

export default class EventEditor extends Component {
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
        this.handleDelete = this.handleDelete.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        // let theEvent = Object.assign({}, this.state.event);
        updateEvent(this.props.location.state.token.waToken, this.state.event.Id, this.state.event, (data) => {console.log("UPDATE RESULT", data)})

        this.setState({event: emptyEvent()});

        this.props.history.push(`/?mid=${this.state.member.id}`);
    }

    onChangeEventName(e) {
        this.setState({event: {...this.state.event, Name: e.target.value }})
    }

    onChangeEventLocation(e) {
        this.setState({event:{...this.state.event, Location: e.target.value}})
    }

    async componentDidMount() {
        // await getAuthTokens((data) => this.setState({waToken: data}));
        this.setState({
            member: this.props.location.state.member,
            eventInfo: this.props.location.state.eventInfo
        })

        // recurring event
        if (this.props.location.state.eventInfo.event && this.state.fetch) {   // user clicked on an event
            if (this.state.eventInfo.event.extendedProps.parentId && this.state.fetch) {
                await getEventById(this.props.location.state.token.waToken, this.state.eventInfo.event.extendedProps.parentId, (data) => {
                    this.setState({event: searchForSessionAndAdjustFields(data, this.state.eventInfo.event.id)});
                });
            } else {
                await getEventById(this.props.location.state.token.waToken, this.state.eventInfo.event.id, (data) => {
                    this.setState({event: data});
                });
            }
        } else if (this.state.eventInfo.date) {  // user clicked on a date to create event.
            this.setState({event: {...this.state.event, StartDate: new  Date(this.state.eventInfo.date)}})
        }
        this.setState({event:{...this.state.event,StartDate: new Date(this.state.event.StartDate)}});
        this.setState({event:{...this.state.event,EndDate: new Date(this.state.event.EndDate)}});
        this.setState({fetch:false});

        if (this.props.location.state.eventInfo.date) {
            let maxTime = new Date(this.props.location.state.eventInfo.date.getTime());
            this.setState({...this.state.event, startDate: this.props.location.state.eventInfo.date});
            this.setState({...this.state.event, endDate: new Date(maxTime.setHours(23,59,59))});
        }

        if (this.state.event && this.state.event.Details && this.state.event.Details.Organizer) {
            await getContact(this.props.location.state.token.waToken, this.state.event.Details.Organizer.Id, (data) => {
                this.setState({organizer: data});
            });
            console.log("contact", this.state.organizer);
        }
    }

    startDateHandler(date) {
        this.setState({event: {...this.state.event, StartDate: date}});
    }

    endDateHandler(date) {
        this.setState({event: {...this.state.event, EndDate: date}});
    }

    handleDelete() {
        deleteEvent(this.props.location.state.token.waToken, this.state.event.Id, (data) => {console.log("DELETE RESULT", data)});

        this.props.history.push(`/?mid=${this.state.member.id}`);
    }

    calendarViewClick() {
        this.props.history.push(`/?mid=${this.props.location.state.member.id}`);
    }

    handleStartChange = async (dt) => {
        await this.setState({date: {...this.state.date, date: dt}});
    }

    render() {
        if (this.state.fetch) {
            return <EventDataLoader name={this.props.location.state.name}/>;
        } else {
            return (
                <div className="App">
                     <div className="editor">
                         <div className="form-group" style={{'text-align':'center'}}>
                             <Button xs onClick={() => this.calendarViewClick()}>Calendar View</Button>
                             <Button xs btnStyle="danger" onClick={() => this.handleDelete()}>Delete Event</Button>
                         </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Event Id: </label>
                                {this.state.event.Id}
                            </div>
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
                                    config={editorConfiguration}
                                    editor={ ClassicEditor }
                                    data={this.state.event.Details.DescriptionHtml}
                                    onChange={ ( event, editor ) => {
                                            let details = this.state.event.Details;
                                            details.DescriptionHtml = editor.getData();
                                            this.setState({event: {...this.state.event, Details: details}});
                                        }
                                    }
                                />
                            </div>

                            <div className="form-group button" style={{'text-align':'center'}}>
                                <Button xs btnStyle="primary" type="submit">Save Event</Button>
                            </div>

                        </form>
                    </div>
                    <div className="userName">
                        {this.props.location.state.member.displayName != null ? this.props.location.state.member.displayName : 'Anonymous'}
                    </div>
                </div>
            )
        }
    }
}

