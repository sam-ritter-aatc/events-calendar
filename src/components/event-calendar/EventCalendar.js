import React, {Component} from 'react';
import {getAuthTokens} from "../../utils/WildApricotOAuthUtils";
import {getEvents} from '../../utils/WildApricotEvents';
import eventConvert from '../../utils/WildApricotConversions';
import {buildRedirect,memberEventTag,firstDateEventsToRetrieve} from "../EventCommon";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from '@fullcalendar/list';
import queryString from 'query-string';
import {Button} from "react-bootstrap-buttons";
import {getContact} from "../../utils/WildApricotContacts";

import "./EventCalendar.css";

export default class EventCalendar extends Component {
    constructor(props) {
        super(props);

        this.calendarComponentRef = React.createRef()

        this.state = {
            member: {id: 0, isAdmin: false},
            calendarWeekends: true,
            waToken: {},
            showEvent: false,
            editEvent: false,
            xid: props.match.params.xid,
            isLoggedInUser: false
        }
    }


    async componentDidMount() {
        const queryStringValues = queryString.parse(this.props.location.search);
        // console.log("QUERY_PARAMS", this.props.location.search,queryStringValues);

        await getAuthTokens((data) => this.setState({waToken: data}));
        if ( queryStringValues.mid && queryStringValues.mid !== "0") {
            await getContact(this.state.waToken, queryStringValues.mid, (contact) => {this.setState({member: contact})})
            // console.log("Retrieve Member", this.state.member);
            this.setState({isLoggedInUser:true})
        }
        await getEvents(this.state.waToken, firstDateEventsToRetrieve(), (data) => {
            var myEvents = eventConvert(data).map((event) => {
                return {
                    id: event.Id,
                    title: event.Name.replace("Weekly Workout - ", "")
                        .replace("Weekly Workout- ",""),  // shorten string in event
                    start: event.StartDate,
                    end: event.EndDate,
                    Url: event.Url,
                    Tags: event.Tags,
                    backgroundColor: this.getEventColor(event),
                    parentId: event.parentId
                }
            });
            this.props.onEventChange(myEvents);
        });
    }

    getEventColor(event) {
        if ( /Race/.test(event.Name) ) {
            return 'red'
        } else if ( event.Tags && event.Tags.indexOf(memberEventTag())> -1) {
             return 'green'
        }
        return 'blue';
    }

    handleWindowResize(arg) {
        console.log("RESIZE", arg);
        arg.updateSize();
    }

    createEvent = () => {
        this.setState({editEvent: this.state.isLoggedInUser, eventInfo: {}})
    }

    handleEventClick = (arg) => {
        // console.log("going to event", arg);
        this.setState({showEvent: true, eventInfo: arg});
    }

    handleDateClick = (e) => {
        // console.log("DATE CLICKED", e);
        this.setState({editEvent: this.state.isLoggedInUser, eventInfo: e});
    }

    render() {
        if (this.state.showEvent) {
            return buildRedirect('showEvent', this.state.member, this.state.eventInfo);
        }
        if (this.state.editEvent) {
            return buildRedirect('createEvent', this.state.member, this.state.eventInfo);
        }
        return (
            <div className='EventCalendar'>
                <FullCalendar
                    defaultView="dayGridMonth"
                    firstDay={1}
                    fixedWeekCount={false}
                    handleWindowResize={true}
                    contentHeight='auto'
                    height='auto'
                    // aspectRatio={3}
                    header={{
                        left: 'prev today next',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,listMonth'
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrapPlugin]}
                    themeSystem="bootstrap"
                    displayEventTime={true}
                    selectable={true}
                    ref={this.calendarComponentRef}
                    weekends={this.state.calendarWeekends}
                    events={this.props.events}
                    dateClick={this.handleDateClick}
                    eventClick={this.handleEventClick}
                    windowResize={this.handleWindowResize}
                />
                {this.state.isLoggedInUser ? <Button xs onClick={this.createEvent}>Create Event</Button> : <div> </div> }
            </div>
        )
    }
}