import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
//import logo from './logo.svg';
import './App.css';
import EventCalendar from "./components/event-calendar/EventCalendar";
import EventDisplay from "./components/event-display/EventDisplay";

function App() {
  return (
    <div className="App">
        <HashRouter basename="/">
            <Route exact path="/" component={EventCalendar} />
            <Route exact path="/showEvent" component={EventDisplay} />
        </HashRouter>
      {/*<EventCalendar />*/}
    </div>
  );
}

export default App;
