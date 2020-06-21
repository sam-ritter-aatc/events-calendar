import React, {Component} from 'react';
import {getAuthTokens} from "../../utils/WildAppricotOAuthUtils";
import {getEventById} from "../../utils/WildApricotEvents";
import SwitchableTextInput from "../SwitchableTextInput";
import renderHTML from 'react-render-html';
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {getContact} from "../../utils/WildApricotContacts";

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
        console.log("EVENT DETAILS", this.props.location.state);
        this.setState({
            member: this.props.location.state.member,
            eventInfo: this.props.location.state.eventInfo
        })

        console.log("STATE",this.state);
        // recurring event
        if (this.state.eventInfo.event.extendedProps.parentId && this.state.fetch) {
            await getEventById(this.state.waToken, this.state.eventInfo.event.extendedProps.parentId, (data) => {
                let e = Object.assign({}, data);
                this.setState({fetch: false});
                console.log("props", this.props);

                let sess = data.Sessions.filter(x => x.Id === Number(this.state.eventInfo.event.id));
                console.log("foundSession", sess);
                if (sess) {
                    e.sessionId = sess[0].Id;
                    e.Name = sess[0].Title;
                    e.StartDate = sess[0].StartDate;
                    e.EndDate = sess[0].EndDate;
                }
                console.log("theEvent", e);
                this.setState({event: e});
                console.log('state', this.state);
            });
        } else {
            await getEventById(this.state.waToken, this.state.eventInfo.event.id, (data) => {
                this.setState({event: data});
            });
        }
    }

    componentWillUnmount() {
        console.log("unmounting########");
    }

    async componentDidMount() {
        await getAuthTokens((data) => this.setState({waToken: data}));
        console.log("Fetching event data");
        await this.eventDetails();
        // console.log('contact values ->', this.state.event, this.state.event.Details, this.state.event.Details.Organizer);
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
        // console.log("eventDisplay", this.props.location.state);
        if (this.state.event === null) {
            return (<EventDataLoader name={this.props.location.state.name}/>);
        } else {
            return (
                <div>
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
                                                                  value={this.state.organizer.display + '(' + this.state.organizer.email + ')'}/>}
                    {this.state.event.Details && this.state.event.Details.DescriptionHtml ? <div><h3>Description</h3>
                        <div>{renderHTML(this.state.event.Details.DescriptionHtml)}</div>
                    </div> : <div></div>}
                </div>
            );
        }
    }
}