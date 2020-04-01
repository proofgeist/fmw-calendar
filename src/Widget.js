import React from "react";
import FullCalendar from "./components/FullCalendar";
import defaultConfig from "./configuration.json";

// the Configurator renders Config Pages. This is always the same.
import Configurator from "./components/lib/Configurator";

// Config Pages are built for each Addon
import ConfigPages from "./components/ConfigPages";

function FCCalendar(initialProps) {
  const Config = initialProps.Config;
  if (!Config || Object.keys(Config).length < 1) {
    initialProps = { ...initialProps, Config: defaultConfig };
    window.__initialProps__ = initialProps;
  }

  if (initialProps.ShowConfig)
    return (
      <Configurator {...initialProps} ConfigPages={ConfigPages}></Configurator>
    );

  return <FullCalendar {...initialProps} />;
}

export default FCCalendar;
