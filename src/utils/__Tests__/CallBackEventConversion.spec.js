const waEvents = require('./test-wa-events-with-sessions.json');
const eventConvert = require('./WildApricotConversions');

describe('converts an array of events(1 item which is recurring session)', () => {
    test('it should convert recurring event', () => {
        let events = eventConvert(waEvents);
        console.log(events);
        expect(events).toEqual([
            {
                id: 2267437,
                startDate: '2018-02-24T10:00:00-05:00',
                endDate: '2018-02-24T17:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 1 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2268653,
                startDate: '2018-02-26T10:00:00-05:00',
                endDate: '2018-02-26T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 2 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2268654,
                startDate: '2018-02-27T10:00:00-05:00',
                endDate: '2018-02-27T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 3 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2268655,
                startDate: '2018-02-28T10:00:00-05:00',
                endDate: '2018-02-28T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 4 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2268656,
                startDate: '2018-03-01T10:00:00-05:00',
                endDate: '2018-03-01T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 5 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2268657,
                startDate: '2018-03-02T10:00:00-05:00',
                endDate: '2018-03-02T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 6 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2268658,
                startDate: '2018-03-03T10:00:00-05:00',
                endDate: '2018-03-03T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 7 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2293459,
                startDate: '2018-03-05T10:00:00-05:00',
                endDate: '2018-03-05T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 8 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2293460,
                startDate: '2018-03-06T10:00:00-05:00',
                endDate: '2018-03-06T20:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 9 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            },
            {
                id: 2293461,
                startDate: '2018-03-07T10:00:00-05:00',
                endDate: '2018-03-07T17:00:00-05:00',
                location: 'Fraser Bicycle, 3162 Packard St, Ann Arbor, MI 48108',
                url: 'https://api.wildapricot.org/v2/accounts/57611/Events/2832286',
                name: 'Fit Kit Sizing - Try on the New Kit!!!! (session 10 of 10)',
                tags: [ 'education', 'meeting', 'social', 'workouts' ],
                parentId: 2832286,
                startTimeSpecified: true,
                endTimeSpecified: true,
                isRecurringSession: true
            }
        ]);
    });
})

