import React, {Component} from 'react';
import {getAuthTokens} from "../../utils/WildApricotOAuthUtils";
import {getEventById} from "../../utils/WildApricotEvents";
import SwitchableTextInput from "../SwitchableTextInput";
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {getContact} from "../../utils/WildApricotContacts";
import SwitchableHtmlDisplay from "../SwitchableHtmlDisplay";
import "./EventDisplay.css";
import {searchForSessionAndAdjustFields, buildRedirect} from "../EventCommon";

export default class EventDisplay extends Component {
    state = {
        fetch: true,
        eventId: '',
        waToken: {},
        url: '',
        event: null,
        organizer: null,
    }

    async eventDetails() {
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
        if (this.state.eventInfo.event.extendedProps.parentId && this.state.fetch) {
            await getEventById(this.state.waToken, this.state.eventInfo.event.extendedProps.parentId, (data) => {
                this.setState({
                    event: searchForSessionAndAdjustFields(data, this.state.eventInfo.event.id),
                    fetch:false
                });
            });
        } else {
            await getEventById(this.state.waToken, this.state.eventInfo.event.id, (data) => {
                this.setState({
                    event: data
                });
            });
        }
        console.log('state', this.state);

        if (this.state.event && this.state.event.Details && this.state.event.Details.Organizer) {
            await getContact(this.state.waToken, this.state.event.Details.Organizer.Id, (data) => {
                this.setState({organizer: data});
                console.log("=====ORG", data, this.state.organizer);
            });
            console.log("contact", this.state.organizer);
        }
        console.log("state", this.state);
        console.log("CAN EDIT", this.canEdit());
    }

    handleEditClick() {
        this.setState({editEvent: true});
    }

    canEdit() {
        return  this.state.member && (
            this.state.member.isAdmin
            || (this.state.event.Details && this.state.event.Details.Organizer && this.state.member.id === this.state.event.Details.Organizer.Id)
        )
    }

    render() {
        if (this.state.fetch) {
            return (<EventDataLoader name={this.props.location.state.name}/>);
        } else if (this.state.editEvent) {
            return buildRedirect('editEvent', this.state.member, this.state.eventInfo);
        } else {
            return (
                <div>
                    {this.canEdit() && <input type="submit" value="Edit Event" className="btn btn-primary" onClick={() => this.handleEditClick()} />}
                    <h2>{this.state.event.Name}</h2>
                    <SwitchableTextInput className="event_id" label="Event Id: " value={this.state.event.Id}/>
                    <SwitchableTextInput className="event-title" label="Event Name: " value={this.state.event.Name}/>
                    <SwitchableTextInput className="event-start" label="Event Start Date/Time: "
                                         value={this.state.event.StartDate}/>
                    <SwitchableTextInput className="event-end" label="Event End Date/Time: "
                                         value={this.state.event.EndDate}/>
                    <SwitchableTextInput className="location" label="Event Location: "
                                         value={this.state.event.Location}/>
                    {this.state.organizer && <SwitchableTextInput className="organizer" label="Organizer: "
                                                                  value={this.state.organizer.displayName + '(' + this.state.organizer.email + ')'}/>}

                    <SwitchableHtmlDisplay className="descriptionHtml" label="Description" value={this.state.event.Details.DescriptionHtml} displayFlag={this.state.event.Details && this.state.event.Details.DescriptionHtml} />
                </div>
            );
        }
    }
}