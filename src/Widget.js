import React, { useState } from "react";
import FullCalendar from "./components/FullCalendar";
import defaultConfig from "./configuration.json";
import Configurator from "./components/Configurator";

import { useFMPerformJS } from "fmw-react-hooks";

function FCCalendar(initialProps) {
  const noConfig = !initialProps.Config.EventPrimaryKeyField;
  const [showConfigurator, setShowConfigurator] = useState(false);

  window.Calendar_ShowConfig = () => {
    setShowConfigurator(true);
  };

  let data;
  if (noConfig) {
    data = { Config: defaultConfig, AddonUUID: initialProps.AddonUUID };
    //  we need an override for no CONFIG
    window.__initialProps__ = data;
  } else {
    data = initialProps;
  }

  if (showConfigurator || noConfig) {
    return <Configurator {...data} />;
  }

  return <FullCalendar {...initialProps} />;
}

export default FCCalendar;
