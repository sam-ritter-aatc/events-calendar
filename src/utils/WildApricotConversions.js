
export const eventConvert = (waEvent) => {
    let eList = [];
    if( Array.isArray(waEvent)) {
        waEvent.forEach((item) => {
            let x = convertSingleEvent(item);
            if( Array.isArray(x)) {
                x.forEach((item) => {
                    eList.push(item);
                })
            } else {
                eList.push(x);
            }
        });
    } else {
        eList.push(convertSingleEvent(waEvent));
    }
    return eList;
}

const convertSingleEvent = (waEvent) => {
    let event = Object.assign({}, waEvent) ;
    if ( waEvent.Sessions ) {
        let eList = [];
        waEvent.Sessions.forEach((item) => {
            let e = Object.assign({}, event);
            e.Id = item.Id;
            e.parentId = event.Id;
            e.Title = item.Title;
            e.StartDate = item.StartDate;
            e.EndDate = item.EndDate;
            e.StartTimeSpecified = item.StartTimeSpecified;
            e.EndTimeSpecified = item.EndTimeSpecified;
            e.isRecurringSession = true;
            e.isOrganizedEvent = item.Details && item.Details.Organizer;
            delete e.Sessions
            eList.push(e);
        })
        return eList;
    } else {
        return event;
    }
}