import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import momentPlugin from "@fullcalendar/moment";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { getConfig } from "fmw-utils";
import {
  transformEvent,
  newEventFetcher,
  dispatchEventToFm,
  getFirstDay
} from "./eventUtils";
import {
  eventRender,
  handleEventDrop,
  handleEventResize,
  handleEventSelect
} from "./events";
import theme from "./event.themes";
import "./main.scss";

export default function Calendar({ Config, webDirectRefresh }) {
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
      currentDate: calendar.state.currentDate,
      calendarDate: calendar.getDate()
    };

    if (window.onWebdInternalRefresh) {
      // this will only run on WebD
      window.sessionStorage.setItem(
        "fccalendar.cache",
        JSON.stringify({
          startView: obj.type,
          defaultDate: calendar.getDate()
        })
      );
    }

    dispatchEventToFm("ViewStateChanged", obj);
  }

  window.Calendar_Refresh = () => {
    if (window._SHOW_CONFIG_) return null; //no-op
    const calendar = getCalendarObj();
    calendar.refetchEvents();
  };

  window.Calendar_SetView = view => {
    if (window._SHOW_CONFIG_) return null; //no-op

    const calendar = getCalendarObj();
    calendar.changeView(view);
    sendViewStateToFM();
  };

  window.Calendar_Next = () => {
    if (window._SHOW_CONFIG_) return null; //no-op
    const calendar = getCalendarObj();
    calendar.next();
    sendViewStateToFM();
  };
  window.Calendar_Prev = () => {
    if (window._SHOW_CONFIG_) return null; //no-op
    const calendar = getCalendarObj();
    calendar.prev();
    sendViewStateToFM();
  };

  window.Calendar_Today = () => {
    if (window._SHOW_CONFIG_) return null; //no-op
    const calendar = getCalendarObj();
    calendar.today();
    sendViewStateToFM();
  };

  const styles = theme(Config.DefaultEventStyle.value);
  let startView = getConfig("StartingView");
  if (startView.toLowerCase() === "day") {
    startView = "timeGridDay";
  } else if (startView.toLowerCase() === "week") {
    startView = "timeGridWeek";
  } else {
    startView = "dayGridMonth";
  }

  let defaultDate;
  if (webDirectRefresh === true) {
    console.log(
      "calendar booting after a webd refresh",
      webDirectRefresh === true
    );
    let cache = window.sessionStorage.getItem("fccalendar.cache");
    try {
      cache = JSON.parse(cache);
      startView = cache.startView;
      defaultDate = cache.defaultDate;
    } catch (e) {}
  }

  const firstDay = getFirstDay();

  return (
    <div className="demo-app">
      <div className="demo-app-calendar">
        <FullCalendar
          firstDay={firstDay}
          nowIndicator={true}
          selectable={true}
          eventDataTransform={transformEvent}
          defaultView={startView}
          defaultDate={defaultDate}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            momentPlugin,
            bootstrapPlugin
          ]}
          header={{ left: "", center: "", right: "" }}
          ref={calendarComponentRef}
          eventSources={[
            {
              events: fetchEvents,
              ...styles
            }
          ]}
          eventBackgroundColor="#E7F5FA"
          eventTextColor="#00425E"
          eventBorderColor="#B9E1F1"
          eventRender={eventRender}
          eventResize={handleEventResize}
          eventDrop={handleEventDrop}
          select={handleEventSelect}
          style={{ borderRadius: "10px" }}
          editable={true}
          lazyFetching={false}
          themeSystem="bootstrap"
        />
      </div>
    </div>
  );
}

Calendar.defaultProps = {
  defaultView: "timeGridWeek"
};
