import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import EventCalendar from "./components/event-calendar/EventCalendar";
import EventDisplay from "./components/event-display/EventDisplay";
import EventEditor from "./components/event-edit/EventEditor";
import EventCreator from "./components/event-create/EventCreator";

function App() {
    return (
        <Router basename="/">
            <div className="App container-fluid">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    {/*<a className="navbar-brand" href="" target="_blank">*/}
                    {/*    <img src="logo" width="30" height="30"></img>*/}
                    {/*</a>*/}
                </nav>
                <Switch>
                    <Route exact path="/" component={EventCalendar}/>
                    <Route exact path="/showEvent" component={EventDisplay}/>
                    <Route exact path="/editEvent" component={EventEditor}/>
                    <Route exact path="/createEvent" component={EventCreator}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
