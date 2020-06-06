
const eventConvert = (waEvent) => {
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
    let event = {} ;
    event.id = waEvent.Id;
    event.startDate = waEvent.StartDate;
    event.endDate = waEvent.EndDate;
    event.location = waEvent.Location;
    event.url = waEvent.Url;
    event.name = waEvent.Name;
    event.tags = waEvent.Tags;

    if ( waEvent.Sessions ) {
        let eList = [];
        waEvent.Sessions.forEach((item) => {
            let e = Object.assign({}, event);
            e.id = item.Id;
            e.parentId = event.id;
            e.name = item.Title;
            e.startDate = item.StartDate;
            e.endDate = item.EndDate;
            e.startTimeSpecified = item.StartTimeSpecified;
            e.endTimeSpecified = item.EndTimeSpecified;
            e.isRecurringSession = true;
            eList.push(e);
        })
        return eList;
    } else {
        return event;
    }
}
module.exports = eventConvert;