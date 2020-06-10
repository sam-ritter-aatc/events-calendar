const waEvents = require('./test-wa-events-with-sessions.json');
const eventConvert = require('../WildApricotConversions');


console.log(eventConvert(waEvents));