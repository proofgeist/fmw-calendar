import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import momentPlugin from "@fullcalendar/moment";

import mergeFieldsAndRecords from "../../utils/mergeFieldsAndRecords";
import "./main.scss";

export default function Calendar({ defaultView, events, onCalendarViewChange }) {
  const [state, setState] = useState(events);

  const calendarComponentRef = useRef();
  const getCalendarObj = () => {
    return calendarComponentRef.current.calendar;
  };

  function callBack() {
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

    window.FileMaker.PerformScript(
      "Handle Calendar View Change",
      JSON.stringify(obj)
    );
  }

  window.calendar = {
    setEvents: events => setState(events),
    setView: view => {
      const calendar = getCalendarObj();
      calendar.changeView(view);
      callBack(calendar.view);
    },
    next: () => {
      const calendar = getCalendarObj();
      calendar.next();
      callBack(calendar.view);
    },
    prev: () => {
      const calendar = getCalendarObj();
      calendar.prev();
      callBack(calendar.view);
    },
    today: () => {
      const calendar = getCalendarObj();
      calendar.today();
      callBack(calendar.view);
    }
  };

  return (
    <div className="demo-app">
      <div className="demo-app-calendar">
        <FullCalendar
          defaultView={defaultView}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            momentPlugin
          ]}
          header={{ left: "", center: "", right: "" }}
          ref={calendarComponentRef}
          events={state}
          dateClick={() => {
            alert("clicked");
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
