import React, { useState } from "react";
import "./main.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import listPlugin from "@fullcalendar/list";
import { onDateClick, onSelectDate } from "./events";

export default function Calendar() {
  const calendarComponentRef = React.createRef();

  //EVENTS
  const [calendarEvents, setEvents] = useState([
    { title: "Event Now", start: new Date() }
  ]);
  window.setEvents = setEvents; // expose to FM

  //CALENDARWEEKEND
  const [calendarWeekends, setCalendarWeekends] = useState(true);
  window.setCalendarWeekends = setEvents; // expose to FM

  //setSelectable
  const [selectAble, setSelectable] = useState(true);
  window.setSelectable = setSelectable; // expose to FM

  return (
    <div className="demo-app">
      <div className="demo-app-calendar">
        <FullCalendar
          defaultView="dayGridMonth"
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
          }}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin
          ]}
          ref={calendarComponentRef}
          weekends={calendarWeekends}
          events={calendarEvents}
          dateClick={onDateClick}
          selectable={selectAble}
          select={onSelectDate}
        />
      </div>
    </div>
  );
}
