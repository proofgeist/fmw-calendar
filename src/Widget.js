import React, { useState } from "react";
import FullCalendar from "./components/FullCalendar";

function Widget(initialProps) {
  return (
    <>
      <FullCalendar {...initialProps} />
    </>
  );
}

export default Widget;
