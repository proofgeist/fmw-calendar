import React, { useState } from "react";
import FullCalendar from "./components/FullCalendar";
import defaultConfig from "./configuration.json";
import Configurator from "./components/Configurator";

function FCCalendar(initialProps) {
  const noConfig = !initialProps.Config.EventPrimaryKeyField;
  const [showConfigurator, setShowConfigurator] = useState(false);

  //need to block FM external calls in while config is showing
  // since they are global we'll have to use a global to block them
  window._SHOW_CONFIG_ = showConfigurator;
  window.Calendar_ShowConfig = () => {
    setShowConfigurator(true);
  };
  const handleCancel = () => setShowConfigurator(false);

  let data;
  if (noConfig) {
    data = { Config: defaultConfig, AddonUUID: initialProps.AddonUUID };
    //  we need an override for no CONFIG
    window.__initialProps__ = data;
  } else {
    data = initialProps;
  }

  if (showConfigurator || noConfig) {
    return <Configurator {...data} onCancel={handleCancel} />;
  }

  return <FullCalendar {...initialProps} showConfigurator={showConfigurator} />;
}

export default FCCalendar;
