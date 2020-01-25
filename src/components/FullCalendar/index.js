import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import moment from "moment";
import momentPlugin from "@fullcalendar/moment";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import {
  transformEvent,
  newEventFetcher,
  dispatchEventToFm
} from "./eventUtils";

import "./main.scss";

export default function Calendar({ config }) {
  const { defaultView } = config;
  const fetchEvents = newEventFetcher(config);

  const calendarComponentRef = useRef();
  const getCalendarObj = () => {
    return calendarComponentRef.current.calendar;
  };

  //run on mount
  useEffect(sendViewStateToFM, []);

  function sendViewStateToFM() {
    const calendar = getCalendarObj();
    const calendarView = calendar.view;

    const obj = {
      title: calendarView.title,
      type: calendarView.type,
      activeStart: calendarView.activeStart,
      activeEnd: calendarView.activeEnd,
      currentStart: calendarView.currentStart,
      currentEnd: calendarView.currentEnd,
      currentDate: calendar.state.currentDate
    };

    dispatchEventToFm("ViewStateChanged", obj);
  }

  window.Calendar_Refresh = () => {
    const calendar = getCalendarObj();
    calendar.refetchEvents();
  };

  window.calendar = {
    setView: view => {
      const calendar = getCalendarObj();
      calendar.changeView(view);
      sendViewStateToFM();
    },
    next: () => {
      const calendar = getCalendarObj();
      calendar.next();
      sendViewStateToFM();
    },
    prev: () => {
      const calendar = getCalendarObj();
      calendar.prev();
      sendViewStateToFM();
    },
    today: () => {
      const calendar = getCalendarObj();
      calendar.today();
      sendViewStateToFM();
    }
  };

  return (
    <div className="demo-app">
      <div className="demo-app-calendar">
        <FullCalendar
          eventDataTransform={transformEvent}
          defaultView={defaultView}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            momentPlugin,
            bootstrapPlugin
          ]}
          header={{ left: "", center: "", right: "" }}
          ref={calendarComponentRef}
          events={fetchEvents}
          dateClick={date => {
            dispatchEventToFm("DateClick", { date: date.dateStr });
          }}
          eventClick={event => {
            dispatchEventToFm("EventClick", { id: event.event.id });
          }}
          eventResize={({ event }) => {
            const { id, end } = event;
            const newEndTimeStamp = moment(end).format("L LTS");
            dispatchEventToFm("EventResized", { id, newEndTimeStamp });
          }}
          eventDrop={event => {
            const oldEvent = event.oldEvent;
            const oldStart = oldEvent.start;
            const delta = event.delta;
            //calc new Format in the FM format for this local
            const newStartTimeStamp = moment(oldStart)
              .add(delta)
              .format("L LTS");

            dispatchEventToFm("EventDropped", {
              newStartTimeStamp,
              id: event.event.id
            });
          }}
          style={{ borderRadius: "10px" }}
          editable={true}
          themeSystem="bootstrap"
        />
      </div>
    </div>
  );
}

Calendar.defaultProps = {
  defaultView: "timeGridWeek"
};
