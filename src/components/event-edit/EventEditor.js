import React, {Component} from 'react';
// import SwitchableTextInput from "../SwitchableTextInput";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import SwitchableDatePicker from "../SwitchableDatePicker";
import {getAuthTokens} from "../../utils/WildApricotOAuthUtils";
import {getEventById} from "../../utils/WildApricotEvents";
import {getContact} from "../../utils/WildApricotContacts";
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {searchForSessionAndAdjustFields} from "../EventCommon";

import "./EventEditor.css";
import SwitchableTextInput from "../SwitchableTextInput";

export default class EventEditor extends Component {
    constructor(props) {
        super(props);
        console.log("INCOMING PROPS", props);

        this.state = {
            event: this.emptyEvent(),
            isEditing: true,
            eventInfo: props.location.state.eventInfo,
            member: props.location.state.member,
            fetch: true
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        // TODO: submit logic here

        this.setState({event: this.emptyEvent()});
    }

    onChangeEventName(e) {
        this.setState({event: {...this.state.event, Name: e.target.value }})
    }

    onChangeEventLocation(e) {
        this.setState({event:{...this.state.event, Location: e.target.value}})
    }

    emptyEvent() {
        return {
            Id: '',
            Url: '',
            EventType: '',
            StartDate: '',
            EndDate: '',
            Location: '',
            RegistrationEnabled: true,
            RegistrationsLimit: null,
            Tags: [],
            AccessLevel: 'Public',
            Details: {
                DescriptionHtml: '',
                Organizer: 0
            },
            Name: ''
        }
    }

    async componentDidMount() {
        await getAuthTokens((data) => this.setState({waToken: data}));
        console.log("EVENT DETAILS", this.props.location.state);
        this.setState({
            member: this.props.location.state.member,
            eventInfo: this.props.location.state.eventInfo
        })

        console.log("STATE",this.state);
        // recurring event
        if (this.state.eventInfo.event && this.state.fetch) {   // user clicked on an event
            if (this.state.eventInfo.event.extendedProps.parentId && this.state.fetch) {
                await getEventById(this.state.waToken, this.state.eventInfo.event.extendedProps.parentId, (data) => {
                    this.setState({event: searchForSessionAndAdjustFields(data, this.state.eventInfo.event.id)});
                });
            } else {
                await getEventById(this.state.waToken, this.state.eventInfo.event.id, (data) => {
                    this.setState({event: data});
                });
            }
        } else if (this.state.eventInfo.date) {  // user clicked on a date to create event.
            this.setState({event: {...this.state.event, StartDate: new  Date(this.state.eventInfo.date)}})
        }
        this.setState({fetch:false});
        console.log('===>state', this.state);

        if (this.state.event && this.state.event.Details && this.state.event.Details.Organizer) {
            await getContact(this.state.waToken, this.state.event.Details.Organizer.Id, (data) => {
                this.setState({organizer: data});
                console.log("=====ORG", data, this.state.organizer);
            });
            console.log("contact", this.state.organizer);
        }
        console.log("state", this.state);
    }

    render() {
        if (this.state.fetch) {
            return <EventDataLoader name={this.props.location.state.name}/>;
        } else {
            return (
                <div className="App">
                    {/*<SwitchableTextInput className="event_id" label="Event Id: " value={this.state.event.Id}/>*/}
                    {/*<SwitchableTextInput className="event-title" label="Event Name: " value={this.state.event.Name}/>*/}
                    {/*<SwitchableTextInput className="event-start" label="Event Start Date/Time: "*/}
                    {/*                     value={this.state.event.StartDate}/>*/}
                    {/*<SwitchableTextInput className="event-end" label="Event End Date/Time: "*/}
                    {/*                     value={this.state.event.EndDate}/>*/}
                    {/*<SwitchableTextInput className="location" label="Event Location: "*/}
                    {/*                     value={this.state.event.Location}/>*/}
                    {/*{this.state.organizer && <SwitchableTextInput className="organizer" label="Organizer: "*/}
                    {/*                                              value={this.state.organizer.displayName + '(' + this.state.organizer.email + ')'}/>}*/}
                    {/*<SwitchableDatePicker label="Date: " editFlag={this.state.isEditing} selected={this.state.event.StartDate} handleChange={this.handleStartChange} />*/}
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
                                        console.log("state", this.state);
                                    } }
                                />
                            </div>

                        </form>



                    </div>
                </div>
            )
        }
    }

    handleStartChange = async (dt) => {
        await this.setState({date: {...this.state.date, date: dt}});
    }

}

