import React, {Component} from 'react';
import {getEvents} from '../../utils/WildApricotEvents';
import {eventConvert} from '../../utils/WildApricotConversions';
import {buildRedirect,memberEventTag,firstDateEventsToRetrieve} from "../EventCommon";
import EventDataLoader from "../event-data-loader/EventDataLoader";

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
            calendarWeekends: true,
            fetch: true,
            showEvent: false,
            editEvent: false,
            xid: props.match.params.xid,
            isLoggedInUser: false
        }
    }


    async componentDidMount() {
        const queryStringValues = queryString.parse(this.props.location.search);

        if ( queryStringValues.mid && queryStringValues.mid !== "0") {
            await getContact(queryStringValues.mid, (contact) => this.props.onMemberChange(contact))
            this.setState({isLoggedInUser:true})
        }
        // console.log("===> getting events.")
        await getEvents(firstDateEventsToRetrieve(), (data) => {
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
            this.setState({fetch: false});
            // console.log("events have been reloaded")
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
        // console.log("RESIZE", arg);
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
            return buildRedirect('showEvent', this.props.member, this.state.eventInfo);
        }
        if (this.state.editEvent) {
            return buildRedirect('createEvent', this.props.member, this.state.eventInfo);
        }
        console.log("###STATE", this.state);
        console.log("SWTICH", localStorage.getItem('firstInFromWildApricot'));

        if (this.state.fetch) {
            console.log('showing loader');
            return (<EventDataLoader name="Event Calendar"/>);
        } else {
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
                    {this.state.isLoggedInUser ? <Button xs onClick={this.createEvent}>Create Event</Button> :
                        <div></div>}
                    <div className="userName">
                        {this.props.member.displayName != null ? this.props.member.displayName : 'Anonymous'}
                    </div>
                </div>
            )
        }
    }
}