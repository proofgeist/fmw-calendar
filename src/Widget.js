import React from "react";
import FullCalendar from "./components/FullCalendar";

function Widget(initialProps) {
  window.Calendar_SetEvents = events => {
    // console.log(events);
  };

  return (
    <>
      <FullCalendar config={{}} {...initialProps} />
    </>
  );
}

export default Widget;

//<FullCalendar events={eventObjs} {...initialProps} />
