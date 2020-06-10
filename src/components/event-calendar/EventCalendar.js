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

// import SwitchableTextInput from "./SwitchableTextInput";
// import SwitchableDatePicker from "./SwitchableDatePicker";
// import SwitchableButton from "./SwitchableButton";


export default class EventCalendar extends Component {
    constructor(props) {
        super(props);
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
        currentEvent: {
            id: '',
            title: '',
            description: '',
            location: '',
            organizer: '',
            start: new Date(),
            end: new Date()
        },
        events: [],
        showCreateModal: false,
        calendarWeekends: true,
        waToken: {}
    }

    async componentDidMount() {
        await getAuthTokens((data) => this.setState({waToken: data}));
        await getEvents(this.state.waToken, '2019-01-01', (data) => {
            var myEvents = eventConvert(data).map((event) => {
                return {
                    id: event.Id,
                    title: event.Name,
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

    getEventColor(event) {
        if ( /Ironman/.test(event.Name) ) {
            return 'red'
        }
        if ( event.isRecurringSession ) {
            return 'green';
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
                id: arg.event.id,
                name: arg.event.title,
                url: arg.event.extendedProps.Url,
                parentId: arg.event.extendedProps.parentId
            }
        });
    }

    handleDateClick = (e) => {
        this.setState({
            isCreateEvent: true,
            isEditing: true,
            currentEvent: e,
        });
        let start = new Date(e.date.getTime());
        let end = new Date(e.date.getTime());
        end.setDate(end.getDate() + 1);

        this.setState({
            currentEvent: {
                id: uuid(),
                start: start,
                end: end
            }
        });

        this.showModal(e);
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

    showModal = e => {
        console.log("showModal - incoming e", e);

        this.modalToggle();
    };

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
