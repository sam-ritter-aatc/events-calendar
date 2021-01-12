import {Redirect} from "react-router-dom";
import React from "react";

export const memberEventTag = () => {
    return 'member-event'
}
export const searchForSessionAndAdjustFields = (sessionData, sessionId) => {
    let e = Object.assign({}, sessionData);

    let sess = sessionData.Sessions.filter(x => x.Id === Number(sessionId));
    // console.log("foundSession", sess);
    if (sess) {
        e.sessionId = sess[0].Id;
        e.Name = sess[0].Title;
        e.StartDate = sess[0].StartDate;
        e.EndDate = sess[0].EndDate;
    }
    // console.log("theEvent", e);
    return e;
}

export const calendarViewClick = () => {
    this.props.history.push(`/?mid=${this.state.member.id}`);
    // console.log("CAL VIEW", this.state.member);
}

export const redirect = (path) => {
    return <Redirect to={{pathname: path}} push />
}

export const buildRedirect = (path, member, eventInfo) => {
    return <Redirect to={{
        pathname: path,
        state: {
            member: member,
            eventInfo: eventInfo
        }
    }} push/>
}

export const emptyEvent = () => {
    return {
        EventType: 'Rsvp',
        StartDate: '',
        EndDate: '',
        Location: '',
        RegistrationEnabled: true,
        EndTimeSpecified: true,
        RegistrationsLimit: 300,
        Tags: [memberEventTag()],
        AccessLevel: 'Public',
        Details: {
            DescriptionHtml: '',
            Organizer: {
                Id: 0,
            },
            AccessControl: {
                AccessLevel: "Public",
                AvailableForAnyLevel: false,
                AvailableForLevels: [],
                AvailableForAnyGroup: false,
                AvailableForGroups: []
            },
            GuestRegistrationSettings: {
                Enabled: true,
                CreateContactMode: "NeverCreateContact"
            }
        },
        Name: ''
    }
}

export const baseRegistration = (contactId, eventId, message) => {
    return {
        Event: {
            Id: eventId
        },
        "Contact": {
            "Id" : contactId
        },
        "RegistrationTypeId": 5895025,
        "GuestRegistrationsSummary": {
            "NumberOfGuests": 0,
            "NumberOfGuestsCheckedIn": 0
        },
        "IsCheckedIn": false,
        "ShowToPublic": true,
        "RegistrationDate": new Date().toDateString(),
        "Memo": message,
        "RecreateInvoice": false
    }
}


export const firstDateEventsToRetrieve = () => {
    let firstDate = new Date();
    // firstDate.setFullYear(firstDate.getFullYear() - 1);
    firstDate.setMonth(firstDate.getMonth() - 6);

    console.log("FIRST DATE", firstDate)

    return firstDate.toISOString()
}

export const fullSetStartDate = () => {
    let firstDate = new Date();
    firstDate.setFullYear(firstDate.getFullYear() - 1);
    firstDate.setMonth(firstDate.getMonth() - 6);

    console.log("FIRST DATE", firstDate)

    return firstDate.toISOString()
}
