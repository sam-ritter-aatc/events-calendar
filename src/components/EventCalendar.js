import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import uuid from "react-uuid";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from '@fullcalendar/list';

import "./EventCalendar.css";

import SwitchableTextInput from "./SwitchableTextInput";
import SwitchableDatePicker from "./SwitchableDatePicker";
import SwitchableButton from "./SwitchableButton";


export default class EventCalendar extends Component {
    constructor(props) {
        super(props);
        // this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEventName = this.onChangeEventName.bind(this);
        this.onChangeEventDescription = this.onChangeEventDescription.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        // this.handleStartChange = this.handleStartChange.bind(this);
        // this.handleEndChange = this.handleEndChange.bind(this);
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
    }

    // componentDidMount() {
    //     fetch('/api/list')
    //         .then(res => res.json())
    //         .then(events => this.setState({events: events, update: true}, () => {
    //             console.log(events);
    //             var myEvents = events.map((event) => {
    //                 return {
    //                     id: event.id,
    //                     title: event.summary,
    //                     start: event.start.dateTime || event.start.date,
    //                     end: event.end.dateTime || event.end.date,
    //                     organizer: event.organizer,
    //                     created: event.created,
    //                     updated: event.updated,
    //                     location: event.location
    //                 }
    //             });
    //             console.log("myEvents", myEvents);
    //             this.setState({events: myEvents});
    //         }))
    //         .catch((error) => console.error(error))
    // }

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
                <Modal
                    isOpen={this.state.showCreateModal}
                    toggle={this.modalToggle}
                    className={this.constructor.name}
                >
                    <ModalHeader toggle={this.modalToggle}>
                        {this.state.isCreateEvent ? "Create New Event" : this.state.currentEvent.title}
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.onSubmit}>
                            {!this.state.isCreateEvent && <div className="form-group">
                                <label>Event ID: {this.state.currentEvent.id}</label>
                            </div>}

                            <SwitchableTextInput label="Event Name: " className="form-group" value={this.state.currentEvent.title} onChange={this.onChangeEventName} inputFlag={this.state.isEditing} />

                            <SwitchableTextInput label="Event Description: " className="form-group" value={this.state.currentEvent.description} onChange={this.onChangeEventDescription} inputFlag={this.state.isEditing} />

                            <SwitchableTextInput label="Event Location: " className="form-group" value={this.state.currentEvent.location} onChange={this.onChangeLocation} inputFlag={this.state.isEditing} />

                            <SwitchableDatePicker label="Start Date: " editFlag={this.state.isEditing} selected={this.state.currentEvent.start} handleChange={this.handleStartChange} start={this.state.currentEvent.start} end={this.state.currentEvent.end}/>

                            <SwitchableDatePicker label="End Date: " editFlag={this.state.isEditing} selected={this.state.currentEvent.end} handleChange={this.handleEndChange} start={this.state.currentEvent.start} end={this.state.currentEvent.end} minDate={this.state.currentEvent.start}/>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <SwitchableButton isVisible={!this.state.isCreateEvent} color="warning" onClick={this.editToggle} isDisabled={false} name="Edit" />
                        <SwitchableButton isVisible={this.state.isEditing} color="primary" onClick={this.saveEvent} isDisabled={!this.state.isEditing} name="Save" />
                        <SwitchableButton isVisible={!this.state.isEditing} color="danger" onClick={this.eventRsvp} isDisabled={false} name="RSVP" />
                        <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <button onClick={this.createEvent}>Create Event</button>
            </div>
        )
    }

    userCanEdit = () => {
        return true;
    }

    eventRsvp = (event) => {
        console.log("event rsvp",this.state.currentEvent);
        alert( "you have been registered for event: "+this.state.currentEvent.title);
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

    handleEventClick = async (arg) => {
        this.setState({
            isCreateEvent: false,
            isEditing: false
        });
        console.log("eventClicked", arg);
        await this.setState({currentEvent: this.state.events.find(x => x.id === arg.event.id)});
        this.showModal(arg)
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
