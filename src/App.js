import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css'


class App extends Component {
  constructor() {
    super();
    this.state = {events: {} };

    this.handleNewEventInput = this.handleNewEventInput.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.enableEditMode = this.enableEditMode.bind(this);
    this.updateCurrentEvent = this.updateCurrentEvent.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents() {
    axios({
      url: '/events.json',
      baseURL: 'https://until-unit-2-project-km.firebaseio.com/',
      method: "GET"
    }).then((response) => {
      if (response.data === null) {
        return;
      }
      this.setState({ events: response.data});
    }).catch((error) => {
      console.log(error);
    });
  }

  createEvent(eventText) {
    let newEvent = { title: eventText, createdAt: new Date};

    axios({
      url: '/events.json',
      baseURL: 'https://until-unit-2-project-km.firebaseio.com/',
      method: "POST",
      data: newEvent
    }).then((response) => {
      this.getEvents()
      // let events = this.state.events;
      // let newEventId = response.data.name;
      // events[newEventId] = newEvent;
      // this.setState({ events: events });
    }).catch((error) => {
      console.log(error);
      });
    }

  deleteEvent(eventId) {
    axios({
      url: `/events/${eventId}.json`,
      baseURL: 'https://until-unit-2-project-km.firebaseio.com/',
      method: "DELETE"
    }).then((response) => {
      let events = this.state.events;
      delete events[eventId];
      this.setState({ events: events });
    }).catch((error) => {
      console.log(error);
    });
  }

  handleNewEventInput(e) {
    if (e.charCode === 13) {
      this.createEvent(e.target.value);
      e.target.value = "";
    }
  }

  renderNewEventBox() {
    return (
      <div className="neweventbox">
        <input className="EventInput" placeholder="What Happening?" onKeyPress={ this.handleNewEventInput } />
      </div>
      );
    }

    renderEventList() {
      let eventElements = [];

      for(let eventId in this.state.events) {
        let event = this.state.events[eventId]

        eventElements.push(
          <div className="eventlistitems" key={eventId}>
            <div className="mt-2" onClick={ () => this.selectEvent(eventId) }>
              <h4>{event.title}</h4>
              <div>{moment(event.createdAt).calendar()}</div>
            </div>
            <button
              className="ml-4 btn btn-link"
              onClick={ () => { this.deleteEvent(eventId) }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        );
      }

      return (
        <div className="event-list">
          {eventElements}
        </div>
      );
    }

    selectEvent(eventId) {
      this.setState({ currentEvent: eventId });
    }

    enableEditMode() {
      this.setState({ edit: true });
    }

    updateCurrentEvent() {
      let id = this.state.currentEvent;
      let currentEvent = this.state.events[id];
      currentEvent.title = this.refs.editEventInput.value;

      axios({
        url: `/events/${id}.json`,
        baseURL: 'https://until-unit-2-project-km.firebaseio.com',
        method: "PATCH",
        data: currentEvent
      }).then((response) => {
        let events = this.state.events;
        events[id] = currentEvent;
        this.setState({ events: events, edit: false });
      }).catch((error) => {
        console.log(error);
      });
    }

    renderSelectedEvent() {
      let content;

      if (this.state.currentEvent) {
        let currentEvent = this.state.events[this.state.currentEvent];
        if(!this.state.edit) {
          content = (
            <div>
              <div className="EditButton">
                <button onClick={this.enableEditMode}>Edit</button>
              </div>
                <h1 className="EventTitle">{currentEvent.title}</h1>
            </div>
            );
        } else {
          content = (
            <div>
              <div className="EventsListed">
                <button onClick={this.updateCurrentEvent}>Save</button>
              </div>
              <input className="w-100" defaultValue={currentEvent.title} ref="editEventInput" />
            </div>
          );
        }
      }

        return content;
    }

    render() {
      return (
      <div className="AppContainer">
        <div className="AppTitle">
        <h1>Until App:</h1>
        <h3>For All the Things That Haven't Happened Yet</h3>
        </div>
        <div className="row pt-3">
          <div className="EventInputField">
            {this.renderNewEventBox()}
            {this.renderEventList()}
          </div>
          <div className="EventDetails">
            {this.renderSelectedEvent()}
          </div>
        </div>
      </div>
      );
    }
  }

  export default App;


