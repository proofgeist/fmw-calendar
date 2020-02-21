import React, { useState } from "react";
import FullCalendar from "./components/FullCalendar";
import defaultConfig from "./configuration.json";
import Configurator from "./components/Configurator";
import Modal from "react-modal";
import { fmFetch } from "fmw-utils";

import { useFMPerformJS } from "fmw-react-hooks";

function Widget(initialProps) {
  const noConfig = !initialProps.Config.EventPrimaryKeyField;

  const showConfigurator = useFMPerformJS(noConfig, "Calendar_ShowConfig");
  //if there is no config this is wrong right now but will deal later

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
      <FullCalendar {...initialProps} />
    </>
  );
}

export default Widget;

//<FullCalendar events={eventObjs} {...initialProps} />

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)" //"rgba(0, 144, 204, 0.05)"
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "1px 3px 10px #9E9E9E"
  }
};

function CalendarConfigurator({ startOpen, ...initialProps }) {
  const [isOpen, setIsOpen] = useState(startOpen);

  window.Calendar_ShowConfig = show => {
    setIsOpen(show);
  };

  const handleSubmit = async data => {
    const result = await fmFetch("FCSaveConfig", data);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal style={customStyles} isOpen={isOpen}>
      <Configurator
        onCancelConfigurator={handleCancel}
        saveToFM={handleSubmit}
        {...initialProps}
      ></Configurator>
    </Modal>
  );
}
