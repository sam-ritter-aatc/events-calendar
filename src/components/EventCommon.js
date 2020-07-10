import {Redirect} from "react-router-dom";
import React from "react";

export const memberEventTag = () => {
    return 'member-event'
}
export const searchForSessionAndAdjustFields = (sessionData, sessionId) => {
    let e = Object.assign({}, sessionData);

    let sess = sessionData.Sessions.filter(x => x.Id === Number(sessionId));
    console.log("foundSession", sess);
    if (sess) {
        e.sessionId = sess[0].Id;
        e.Name = sess[0].Title;
        e.StartDate = sess[0].StartDate;
        e.EndDate = sess[0].EndDate;
    }
    console.log("theEvent", e);
    return e;
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
        // Id: '',
        // Url: '',
        EventType: 'Rsvp',
        StartDate: '',
        EndDate: '',
        Location: '',
        RegistrationEnabled: true,
        EndTimeSpecified: true,
        RegistrationsLimit: 100,
        Tags: [memberEventTag()],
        AccessLevel: 'Public',
        Details: {
            DescriptionHtml: '',
            Organizer: {
                Id: 0,
                // Url: ''
            },
            AccessControl: {
                AccessLevel: "Public",
                AvailableForAnyLevel: false,
                AvailableForLevels: [],
                AvailableForAnyGroup: false,
                AvailableForGroups: []
            },

        },
        Name: ''
    }
}
