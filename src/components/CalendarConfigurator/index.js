import React, { useState } from "react";
import Configurator from "./Configurator";
import Modal from "react-modal";
import { fmFetch } from "fmw-utils";

// some styles
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
    await fmFetch("FCCalendarSaveConfig", data);
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

export default CalendarConfigurator;
