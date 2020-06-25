export const makeEventInfoForProps_Recurring = () => {
    let e = {
        el: null,
        event: {
            end: '2020-05-10T20:00:00.000Z',
            start: '2020-05-10T08:00:00.000Z',
            title: 'the thing',
            id: '3769575',
            extendedProps: {
                parentId: 3868592
            }
        },
        jsEvent: {},
        // jsEvent: MouseEvent,
        view: {}
        // view: DayGridView
    }
}

export const makeEventInfoForProps_NonRecurring = () => {
    let e = {
        el: null,
        event: {
            end: '2020-06-10T20:00:00.000Z',
            start: '2020-06-10T08:00:00.000Z',
            title: 'the thing',
            id: '1234235',
            extendedProps: {}
        },
        jsEvent: {},
        // jsEvent: MouseEvent,
        view: {}
        // view: DayGridView
    }
}