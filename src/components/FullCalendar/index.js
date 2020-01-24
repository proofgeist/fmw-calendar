import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import moment from "moment";
import momentPlugin from "@fullcalendar/moment";
import bootstrapPlugin from "@fullcalendar/bootstrap";

import "./main.scss";

export default function Calendar({ defaultView, events }) {
  const [state, setState] = useState(events);

  useEffect(() => {
    const calendar = getCalendarObj();
    callBack(calendar.view);
  }, [defaultView]);

  const calendarComponentRef = useRef();
  const getCalendarObj = () => {
    return calendarComponentRef.current.calendar;
  };

  function callBack() {
    const { Config } = window.fmw.getInitialProps();
    const { FieldNames, CalendarTable } = Config;
    const calendar = getCalendarObj();
    const calendarView = calendar.view;

    const activeStart =
      moment(calendarView.activeStart).format("L") + " 00:00:00";
    const activeEnd =
      moment(calendarView.activeEnd)
        .add(1, "days")
        .format("L") + " 00:00:00";

    let fieldArray = FieldNames.split("\r");

    fieldArray = fieldArray.map(field => {
      const split = field.split("::");

      return `"${split[0]}"."${split[1]}"`;
    });

    const fieldSelect = fieldArray.join(", ");

    const obj = {
      title: calendarView.title,
      type: calendarView.type,
      activeStart: activeStart,
      activeEnd: activeEnd,
      currentStart: calendarView.currentStart,
      currentEnd: calendarView.currentEnd,
      currentDate: calendar.state.currentDate,
      sql: `SELECT ${fieldSelect} from ${CalendarTable} where "Start" >= '${activeStart}' AND "End" < '${activeEnd}'`
    };

    dispatchEventToFm("TitleChanged", obj);
  }

  function dispatchEventToFm(EventType, Data) {
    const { Config, InstanceId } = window.fmw.getInitialProps();
    const param = { EventType, Data, Config, InstanceId };
    window.FileMaker.PerformScript(
      "Handle Calender Event",
      JSON.stringify(param)
    );
  }

  window.calendar = {
    setEvents: events => {
      setState(events);
    },
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
            momentPlugin,
            bootstrapPlugin
          ]}
          header={{ left: "", center: "", right: "" }}
          ref={calendarComponentRef}
          events={(fetchInfo, successCallback, failureCallback) => {
            console.log(fetchInfo, successCallback, failureCallback);
          }}
          dateClick={date => {
            const calendar = getCalendarObj();

            console.log("plpp", calendar.refetchEvents());

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

function getNewTimes(event) {
  console.log(event, event.event.start);

  const oldEvent = event.oldEvent;
  const oldStart = oldEvent.start;
  const delta = event.delta;
  //calc new Format in the FM format for this local
  const newStartTimeStamp = moment(oldStart)
    .add(delta)
    .format("L LTS");
}
