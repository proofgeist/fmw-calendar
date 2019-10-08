import React from "react";
import Calendar from "./components/Calendar";

if (!window.FileMaker) {
  window.FileMaker = {
    PerformScript: function(scriptName, parameter) {
      alert("CALL FM Script: `" + scriptName + "` with `" + parameter + "'");
    }
  };
}

export default function App() {
  return <Calendar></Calendar>;
}
