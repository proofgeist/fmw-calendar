import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import momentPlugin from "@fullcalendar/moment";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import {
  transformEvent,
  newEventFetcher,
  dispatchEventToFm
} from "./eventUtils";
import { eventRender, handleEventDrop, handleEventResize } from "./events";
import "./main.scss";

export default function Calendar({ AddonUUID, Meta, Config }) {
  const { defaultView } = Config;
  const fetchEvents = newEventFetcher(Config);

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

  window.Calendar_SetView = view => {
    const calendar = getCalendarObj();
    calendar.changeView(view);
    sendViewStateToFM();
  };

  window.Calendar_Next = () => {
    const calendar = getCalendarObj();
    calendar.next();
    sendViewStateToFM();
  };
  window.Calendar_Prev = () => {
    const calendar = getCalendarObj();
    calendar.prev();
    sendViewStateToFM();
  };

  window.Calendar_Today = () => {
    const calendar = getCalendarObj();
    calendar.today();
    sendViewStateToFM();
  };

  return (
    <div className="demo-app">
      <div className="demo-app-calendar">
        <FullCalendar
          nowIndicator={true}
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
          eventRender={eventRender}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
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
