import React, {Component} from 'react';

import {getAuthTokens} from "../../utils/WildAppricotOAuthUtils";
import {getEvents} from '../../utils/WildApricotEvents';
import eventConvert from '../../utils/WildApricotConversions';

import uuid from "react-uuid";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from '@fullcalendar/list';


import "./EventCalendar.css";
import {getContact} from "../../utils/WildApricotContacts";

// import SwitchableTextInput from "./SwitchableTextInput";
// import SwitchableDatePicker from "./SwitchableDatePicker";
// import SwitchableButton from "./SwitchableButton";


export default class EventCalendar extends Component {
    constructor(props) {
        super(props);
        console.log("CREATEING EVENT CALENDAR");
        if (this.props.match.params.memberId) {
            console.log("RECEIVED MEMBERID", this.props.match.params.memberId);
        }
        // this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEventName = this.onChangeEventName.bind(this);
        this.onChangeEventDescription = this.onChangeEventDescription.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        // this.handleStartChange = this.handleStartChange.bind(this);
        // this.handleEndChange = this.handleEndChange.bind(this);
        console.log('result', process.env.REACT_APP_WA_OAUTH_URL);
    }

    calendarComponentRef = React.createRef()

    state = {
        isCreateEvent: false,
        isEditing: false,
        // currentEvent: {
        //     id: '',
        //     title: '',
        //     description: '',
        //     location: '',
        //     organizer: '',
        //     start: new Date(),
        //     end: new Date()
        // },
        events: [],
        member: null,
        showCreateModal: false,
        calendarWeekends: true,
        waToken: {}
    }

    async componentDidMount() {
        let firstDate = new Date();
        firstDate.setFullYear(firstDate.getFullYear() - 1);
        firstDate.setMonth(firstDate.getMonth() - 6);
        console.log("FIRST DATE", firstDate)

        await getAuthTokens((data) => this.setState({waToken: data}));
        if ( this.props.match.params.memberId && this.props.match.params.memberId !== "0") {
            await getContact(this.state.waToken, this.props.match.params.memberId, (contact) => {this.setState({member: contact})})
            console.log("Retrieve Member", this.state.member);
        }
        await getEvents(this.state.waToken, firstDate.toISOString(), (data) => {
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
            // console.log("myEvents", myEvents);
            this.setState({events: myEvents});
        });
    }

    fixEventName(name) {
        return name;
    }

    getEventColor(event) {
        if ( /Race/.test(event.Name) ) {
            return 'red'
        }
        return 'blue';
    }

    modalToggle = () => {
        this.setState({showCreateModal: !this.state.showCreateModal});
    }

    editToggle = () => {
        this.setState({isEditing: !this.state.isEditing});
    }

    render() {
        return (
            <div className='EventCalendar'>
                <FullCalendar
                    defaultView="dayGridMonth"
                    firstDay={1}
                    fixedWeekCount={false}
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
                    events={this.state.events}
                    dateClick={this.handleDateClick}
                    eventClick={this.handleEventClick}
                />
                <button onClick={this.createEvent}>Create Event</button>
            </div>
        )
    }

    userCanEdit = () => {
        return true;
    }

    eventRsvp = (event) => {
        console.log("event rsvp", this.state.currentEvent);
        alert("you have been registered for event: " + this.state.currentEvent.title);
    }

    saveEvent = (event) => {
        this.modalToggle();
        console.log("saving event", this.state.currentEvent);
        if (this.state.isCreateEvent) {
            this.setState({
                events: this.state.events.concat(Object.assign({}, this.state.currentEvent))
            })
        } else {
            let idx = this.state.events.findIndex(x => x.id === this.state.currentEvent.id)
            let eventsCopy = [...this.state.events];
            eventsCopy[idx] = this.state.currentEvent;
            this.setState({events: eventsCopy});
        }
        this.clearCurrentEvent();
    }

    clearCurrentEvent = async () => {
        await this.setState({currentEvent: {}});
        console.log("state", this.state);
    }

    handleEventClick = (arg) => {
        console.log("going to event", arg);
        this.props.history.push({
            pathname: '/showEvent',
            state: {
                id: parseInt(arg.event.id, 10),
                name: arg.event.title,
                url: arg.event.extendedProps.Url,
                parentId: arg.event.extendedProps.parentId
            }
        });
    }

    handleDateClick = (e) => {
        console.log("DATE CLICKED", e);
        this.props.history.push({
            pathname: '/editEvent',
            state: {
                date: new Date(e.date.getTime())
            }
        })
    }

    createEvent = () => {
        this.setState({
            isCreateEvent: true,
            isEditing: true,
        });
        let start = new Date();
        let end = new Date();
        end.setDate(end.getDate() + 1);

        this.setState({
            currentEvent: {
                id: uuid(),
                start: start,
                end: end
            }
        });

        this.showModal();
    }
    //
    // showModal = e => {
    //     console.log("showModal - incoming e", e);
    //
    //     this.modalToggle();
    // };

    onChangeEventName = async (e) => {
        await this.setState({currentEvent: {...this.state.currentEvent, title: e}});
    }
    onChangeEventDescription = async (e) => {
        await this.setState({currentEvent: {...this.state.currentEvent, description: e}});
    }
    onChangeLocation = async (e) => {
        await this.setState({currentEvent: {...this.state.currentEvent, location: e}});
    }

    handleStartChange = async (date) => {
        await this.setState({currentEvent: {...this.state.currentEvent, start: date}});
    }

    handleEndChange = async (date) => {
        await this.setState({currentEvent: {...this.state.currentEvent, end: date}});
    }
}
