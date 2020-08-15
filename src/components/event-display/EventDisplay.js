import React, {Component} from 'react';
import {Button} from 'react-bootstrap-buttons';
import {getAuthTokens} from "../../utils/WildApricotOAuthUtils";
import {getEventById} from "../../utils/WildApricotEvents";
import EventDataLoader from "../event-data-loader/EventDataLoader";
import {getContact} from "../../utils/WildApricotContacts";
import {searchForSessionAndAdjustFields, buildRedirect} from "../EventCommon";
import {getRegistrationsForEventId, registerUserForEventId, unregisterFromEvent, updateRegistration} from "../../utils/WildApricotRegistrations";
import {sendEmail} from "../../utils/WildApricotEmailSender";
import renderHTML from "react-render-html";
import Modal from "react-bootstrap/Modal";
import "./EventDisplay.css";

export default class EventDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetch: true,
            eventId: '',
            waToken: {},
            url: '',
            event: null,
            organizer: null,
            modalToggle: false,
            rsvpMessage: "",
            rsvpModalTitle: "",
            modalTextBoxType: ""
        }
        this.toggle = this.toggle.bind(this);
        this.onChangeRsvpMessage = this.onChangeRsvpMessage.bind(this);
    }

    calendarViewClick() {
        this.props.history.push(`/?mid=${this.state.member.id}`);
        console.log("CAL VIEW", this.state.member);
    }

    toggle() {
        this.setState({modalToggle:!this.state.modalToggle});
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
        await this.getEvent();
        await getRegistrationsForEventId(this.state.waToken, this.state.eventInfo.event.id, (data) => {
            let regArray = data.map((reg) => this.convertRegistrationData(reg))
            this.setState({registrations: regArray});
        })
        this.setState({fetch:false});
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

    async getEvent() {
        if (this.state.eventInfo.event.extendedProps.parentId && this.state.fetch) {
            await getEventById(this.state.waToken, this.state.eventInfo.event.extendedProps.parentId, (data) => {
                this.setState({event: searchForSessionAndAdjustFields(data, this.state.eventInfo.event.id),});
            });
        } else {
            await getEventById(this.state.waToken, this.state.eventInfo.event.id, (data) => {
                this.setState({event: data});
            });
        }

    }

    convertRegistrationData(reg) {
        console.log("CONVERT REG", reg);
        return {
            regId: reg.Id,
            memberId: reg.Contact.Id,
            eventId: reg.Event.Id,
            name: reg.DisplayName,
            message: reg.Memo,
            numGuests: reg.GuestRegistrationsSummary && reg.GuestRegistrationsSummary.NumberOfGuests ? reg.GuestRegistrationsSummary.NumberOfGuests : 0,
            dateRegistered: reg.RegistrationDate
        }
    }

    handleEditClick() {
        this.setState({editEvent: true});
    }

    canEdit() {
        return  this.state.member && this.state.eventInfo.event.extendedProps.parentId === undefined && (
            this.state.member.isAdmin || this.isUserEventOrganizer()
        )
    }

    isUserEventOrganizer() {
        return this.state.event.Details && this.state.event.Details.Organizer && this.state.member.id === this.state.event.Details.Organizer.Id;
    }

    notAlreadyRegistered() {
        return this.state.member && this.state.registrations.filter( x => this.state.member.id === x.memberId).length === 0
    }

    async handleRegisterClick() {
        await registerUserForEventId(this.state.waToken, this.state.event.Id, this.state.member.id, (data) => {
            console.log("registration response", data);
            this.setState( state => {
                const registrations = [this.convertRegistrationData(data), ...state.registrations];
                return {
                    registrations
                }
            });
        });
    }

    async handleUnRegisterClick(regId) {
        await unregisterFromEvent(this.state.waToken, regId, (data) => {});
        this.setState( state => {
            const registrations = state.registrations.filter(reg => reg.regId !== regId);
            return {
                registrations
            }
        })
    }

    async handleAddGuest(regId) {
        let reg = this.findRegistrationByRegId(regId);
        reg.numGuests = reg.numGuests+1;
        await updateRegistration(this.state.waToken, reg, (data) => {
            console.log("ADDED GUEST", data);
            this.updateRegistrationInState(reg, data);
        });
        console.log("STATE", this.state);
    }

    async handleAddMessage() {
        let reg = Object.assign({}, this.state.registration);
        reg.message = this.state.rsvpMessage;

        await updateRegistration(this.state.waToken, reg, (data)=> {
            console.log("DATA from add MEssage", data);
            this.updateRegistrationInState(reg, data);
        })

        this.setState({registration:null, rsvpMessage:''});
        this.toggle();
        console.log("SAVED MESSAGE");
    }

    async handleMessagingClick() {
        await this.setState({rsvpModalTitle: "Message to RSVP Contacts", modalTextBoxType: "textarea"})
        this.toggle();
    }

    async handleSendMessage() {
        sendEmail(this.state.waToken, this.state.event.Id, this.state.registrations, this.messageSubject(), this.memberMessage(),(data)=>console.log(data));
        await this.setState({
            rsvpModalTitle: '',
            rsvpMessage: '',
            modalTextBoxType: "text"
        });
        this.toggle();
    }
    messageSubject() {
        return "Event Update: "+this.state.event.Name+ "  "+ new Date(this.state.event.StartDate).toLocaleString();
    }
    memberMessage() {
        return "<html><body>This is concerning the event you RSVP'd to on: "+new Date(this.state.event.StartDate).toLocaleString()+"<h2>"+this.state.event.Name
        + "</h2><p><h3><u>Message from the event organizer</u>:</h3>"+ this.state.rsvpMessage+"</body></html>";
    }

    updateRegistrationInState(reg, data) {
        this.setState(state => {
            console.log("REGISTRATION convertedDAta", this.convertRegistrationData(data));
            const registrations = state.registrations.map((item) => {
                return item.regId === reg.regId ? this.convertRegistrationData(data) : item;
            });
            console.log("REGISTRATION", registrations);

            return {
                registrations
            };
        });
    }

    async addMessageModal(regId) {
        let reg = this.findRegistrationByRegId(regId);
        await this.setState({registration: reg, rsvpMessage: reg.message, rsvpModalTitle: "RSVP Message", modalTextBoxType: "text"});
        this.toggle();
    }

    onChangeRsvpMessage(x) {
        this.setState({rsvpMessage: x.target.value});
    }

    findRegistrationByRegId(regId) {
        let regArray = this.state.registrations.filter(reg => reg.regId === regId);
        if (regArray.length === 1) {
            return regArray[0];
        } else {
            return null;
        }
    }

    renderRegistrationData() {
        return this.state.registrations.map( (reg, index) => {
            const { regId, name, message, numGuests, dateRegistered} = reg;
            return <tr key={regId}>
                <td>{regId}</td>
                <td>{name}</td>
                <td>{numGuests}</td>
                <td>{dateRegistered}</td>
                <td>{message}</td>
            </tr>
        })
    }

    render() {
        // console.log("STATE", this.state);
        let regData = this.state.registrations ? this.state.registrations.filter(reg => reg.memberId === this.state.member.id):[];

        if (this.state.fetch) {
            return (<EventDataLoader name={this.props.location.state.name}/>);
        } else if (this.state.editEvent) {
            return buildRedirect('editEvent', this.state.member, this.state.eventInfo);
        } else {
            return (
                <div>
                    <Button xs onClick={() => this.calendarViewClick()}>Calendar View</Button>
                    {this.canEdit() && <Button xs btnStyle="primary" onClick={() => this.handleEditClick()}>Edit Event</Button>}
                    {this.canEdit() && <Button xs btnStyle="warning" onClick={() => this.handleMessagingClick()}>Message RSVPd Members</Button>}
                    {this.notAlreadyRegistered() && <Button xs btnStyle="success" onClick={() => this.handleRegisterClick()}>RSVP</Button>}
                    {regData.length===1 && !this.isUserEventOrganizer() && <Button xs btnStyle="danger" onClick={() => this.handleUnRegisterClick(regData[0].regId) }>Unregister</Button> }
                    {regData.length===1 && <Button xs btnStyle="secondary" onClick={() => this.handleAddGuest(regData[0].regId)}>Add Guest</Button> }
                    {regData.length===1 && <Button xs btnStyle="secondary" onClick={() => this.addMessageModal(regData[0].regId)}>Add/Edit Message</Button> }

                    <h2>{this.state.event.Name}</h2>
                    <div className="event_id">
                        <label>Event Id: </label>&nbsp;&nbsp;
                        {this.state.event.Id}
                    </div>
                    <div className="event-title">
                        <label>Event Name: </label>&nbsp;&nbsp;
                        {this.state.event.Name}
                    </div>
                    <div className="event-start">
                        <label>Event Start Date/Time:</label>&nbsp;&nbsp;
                        {new Date(this.state.event.StartDate).toLocaleString()}
                    </div>
                    <div className="event-end">
                        <label>Event End Date/Time:</label>&nbsp;&nbsp;
                        {new Date(this.state.event.EndDate).toLocaleString()}
                    </div>
                    <div className="location">
                        <label>Event Location: </label>&nbsp;&nbsp;
                        {this.state.event.Location}
                    </div>

                    {this.state.organizer && <div className="organizer">
                        <label>Organizer: </label>&nbsp;&nbsp;
                        {this.state.organizer.displayName + '(' + this.state.organizer.email + ')'}
                    </div>}

                    <div className="descriptionHtml">
                        <label>Description: </label><br/>&nbsp;&nbsp;
                        <div>{renderHTML(this.state.event.Details.DescriptionHtml)}</div>
                    </div>

                    <div className="registrations">
                        <label>Registrations: </label><br/>
                        <table id='registrations' className="table-striped">
                            <tbody>
                                <tr>
                                    <th scope="col">Registration Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">#Guests</th>
                                    <th scope="col">Date Registered</th>
                                    <th scope="col">Message</th>
                                </tr>
                                {this.renderRegistrationData()}
                            </tbody>
                        </table>
                    </div>

                    <Modal
                        show={this.state.modalToggle}
                        onHide={this.toggle}
                        size="lg"
                        backdrop="static"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {this.state.rsvpModalTitle}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4>Please enter your message:</h4>
                            <p>
                                {this.state.modalTextBoxType==='textarea' ? <textarea
                                        value={this.state.rsvpMessage}
                                        className="form-control"
                                        onChange={this.onChangeRsvpMessage}
                                    />
                                    :
                                    <input type="text"
                                       value={this.state.rsvpMessage}
                                       className="form-control"
                                       onChange={this.onChangeRsvpMessage}
                                       />
                                    }
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button xs btnStyle="danger" onClick={this.toggle}>Cancel</Button>
                            {this.state.modalTextBoxType === 'textarea' ?
                                <Button xs onClick={() => this.handleSendMessage()}>Send Message</Button>
                                :
                                <Button xs onClick={() => this.handleAddMessage()}>Save</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                </div>
            );
        }
    }
}