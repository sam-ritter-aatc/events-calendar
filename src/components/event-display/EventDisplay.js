import React, {Component} from 'react';
import {getAuthTokens} from "../../utils/WildAppricotOAuthUtils";
import {getEventById} from "../../utils/WildApricotEvents";
import SwitchableTextInput from "../SwitchableTextInput";
import renderHTML from 'react-render-html';
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {getContact} from "../../utils/WildApricotContacts";
const clone = require('rfdc')();

export default class EventDisplay extends Component {
    constructor(props) {
        super(props);
        console.log("display", props);
    }

    state = {
        eventId: '',
        waToken: {},
        url: '',
        event: null,
        organizer: null,
    }

    async eventDetails() {
        // recurring event
        if( this.props.location.state.parentId ) {
            await getEventById(this.state.waToken, this.props.location.state.parentId, (data) => {
                let e = clone(data);
                for( let [k,v] of Object.entries(e.Sessions)) {
                    k = k;
                    if( v.Id === this.props.location.state.id ){
                        e.EndDate = v.EndDate;
                        e.StartDate = v.StartDate;
                        e.Name = v.Title;
                        e.sessionId = v.Id;
                        break;
                    }
                }
                this.setState({event: e});
                console.log('state', this.state);
            });
        } else {
            await getEventById(this.state.waToken, this.props.location.state.id, (data) => {
                this.setState({event: data});
            });
        }
    }

    componentWillUnmount() {
        console.log("unmounting########");
    }

    async componentDidMount() {
        await getAuthTokens((data) => this.setState({waToken: data}));
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
        console.log("eventDisplay", this.props.location.state);
        if (this.state.event === null) {
            return (<EventDataLoader name={this.props.location.state.name} /> );
        } else {
            return (
                <div>
                    <h2>{this.state.event.Name}</h2>
                    <SwitchableTextInput className="event_id" label="Event Id: " value={this.state.event.Id}/>
                    <SwitchableTextInput className="event-title" label="Event Name: " value={this.state.event.Name}/>
                    <SwitchableTextInput className="event-start" label="Event Start Date/Time: " value={this.state.event.StartDate} />
                    <SwitchableTextInput className="event-end" label="Event End Date/Time: " value={this.state.event.EndDate} />
                    <SwitchableTextInput className="location" label="Event Location: " value={this.state.event.Location} />
                    {this.state.organizer && <SwitchableTextInput className="organizer" label="Organizer: " value={this.state.organizer.display+'('+this.state.organizer.email+')'} />}
                    {this.state.event.Details && this.state.event.Details.DescriptionHtml ? <div><h3>Description</h3>
                        <div>{renderHTML(this.state.event.Details.DescriptionHtml)}</div>
                    </div> : <div></div> }
                </div>
            );
        }
    }
}