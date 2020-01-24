import React, { useState } from "react";
import FullCalendar from "./components/FullCalendar";

import mergeFieldsAndRecords from "./utils/mergeFieldsAndRecords";

function Widget(initialProps) {
  const [events, setEvents] = useState([]);

  window.Calendar_SetEvents = events => {
    setEvents(JSON.parse(events));
  };

  const eventObjs = mergeFieldsAndRecords(
    ["id", "title", "editable", "start", "end", "allDay"],
    events
  );

  return (
    <>
      <FullCalendar events={eventObjs} {...initialProps} />
    </>
  );
}

export default Widget;
