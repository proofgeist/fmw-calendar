import React from "react";
import FullCalendar from "./components/FullCalendar";
import defaultConfig from "./configuration.json";
import Configurator from "./components/Configurator";

function FCCalendar(initialProps) {
  const Config = initialProps.Config;
  if (!Config || Object.keys(Config).length < 1) {
    initialProps = { ...initialProps, Config: defaultConfig };
    window.__initialProps__ = initialProps;
  }

  if (initialProps.ShowConfig) return <Configurator {...initialProps} />;

  return <FullCalendar {...initialProps} />;
}

export default FCCalendar;
