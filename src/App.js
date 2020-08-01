import React, {Component} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import EventCalendar from "./components/event-calendar/EventCalendar";
import EventDisplay from "./components/event-display/EventDisplay";
import EventEditor from "./components/event-edit/EventEditor";
import EventCreator from "./components/event-create/EventCreator";

export default class App extends Component {
    render() {

        return (
            <Router basename="/">
                <div className="App container-fluid">
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
}
