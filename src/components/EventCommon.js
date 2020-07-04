import {Redirect} from "react-router-dom";
import React from "react";

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
