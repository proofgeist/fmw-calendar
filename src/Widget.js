import React from "react";
import FullCalendar from "./components/FullCalendar";
import defaultConfig from "./configuration.json";
import CalendarConfigurator from "./components/CalendarConfigurator";

import { useFMPerformJS } from "fmw-react-hooks";

function FCCalendar(initialProps) {
  //has a config been loaded yet
  const noConfig = !initialProps.Config.EventPrimaryKeyField;
  const showConfigurator = useFMPerformJS(noConfig, "Calendar_ShowConfig");
  let data;
  if (noConfig) {
    data = { Config: defaultConfig, AddonUUID: initialProps.AddonUUID };
    //  we need an override for no CONFIG
    window.__initialProps__ = data;
  } else {
    data = initialProps;
  }

  return (
    <>
      <CalendarConfigurator
        headerText="Calendar Configurator"
        topWidth="400px"
        startOpen={showConfigurator}
        {...data}
      />
      {noConfig ? null : <FullCalendar {...initialProps} />}
    </>
  );
}

export default FCCalendar;
