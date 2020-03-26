import { dispatchEventToFm } from "./eventUtils";
import { getConfig } from "fmw-utils";
import moment from "moment";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import "tippy.js/themes/light-border.css";

const handleDoubleClick = event => {
  const idFieldName = getConfig("EventPrimaryKeyField");
  const eventDisplayLayout = getConfig("EventDetailLayout");

  const editable = event.event.editable;

  dispatchEventToFm("EventClick", {
    id: event.event.id,
    eventDisplayLayout,
    idFieldName,
    editable
  });
};

export const eventRender = event => {
  // we need to do our own event handler here, to do doubleclick
  event.el.addEventListener("dblclick", () => {
    handleDoubleClick(event);
  });

  const desc = event.event.extendedProps.description;

  if (desc) {
    tippy(event.el, {
      content: desc,
      allowHTML: false,
      theme: "light",
      placement: "top",
      delay: "1000"
    });
  }
};

export const handleEventResize = ({ event }) => {
  const { id, end } = event;
  const endDateFieldName = getConfig("EventEndDateField");
  const endTimeFieldName = getConfig("EventEndTimeField");
  const idFieldName = getConfig("EventPrimaryKeyField");
  const newEndTime = moment(end).format("HH:mm:ss");
  const newEndDate = moment(end).format("YYYY+MM+DD");
  const eventDisplayLayout = getConfig("EventDetailLayout");
  dispatchEventToFm("EventResized", {
    id,
    endTimeFieldName,
    idFieldName,
    newEndTime,
    newEndDate,
    endDateFieldName,
    eventDisplayLayout
  });
};

export const handleEventDrop = event => {
  const oldEvent = event.oldEvent;
  const oldStart = oldEvent.start;
  const oldEnd = oldEvent.end;
  const delta = event.delta;
  const idFieldName = getConfig("EventPrimaryKeyField");
  const startDateFieldName = getConfig("EventStartDateField");
  const endDateFieldName = getConfig("EventEndDateField");
  const startTimeFieldName = getConfig("EventStartTimeField");
  const endTimeFieldName = getConfig("EventEndTimeField");
  const eventDisplayLayout = getConfig("EventDetailLayout");
  //calc new Format in the FM format for this local
  const newStartTimeStamp = moment(oldStart).add(delta);
  const newStartDate = newStartTimeStamp.format("YYYY+MM+DD");
  const newStartTime = newStartTimeStamp.format("HH:mm:ss");

  const newEndTimeStamp = moment(oldEnd).add(delta);
  const newEndDate = newEndTimeStamp.format("YYYY+MM+DD");
  const newEndTime = newEndTimeStamp.format("HH:mm:ss");
  console.log(newStartDate, newStartTime);
  console.log(newEndDate, newEndTime);

  dispatchEventToFm("EventDropped", {
    eventDisplayLayout,
    idFieldName,
    id: event.event.id,
    startDateFieldName,
    newStartDate,
    endDateFieldName,
    newEndDate,
    startTimeFieldName,
    newStartTime,
    endTimeFieldName,
    newEndTime
  });
};

export const handleEventSelect = selectInfo => {
  const { allDay, end: endTS, start: stateTS } = selectInfo;

  const StartDateStr = moment(stateTS).format("YYYY+MM+DD");
  const StartTimeStr = moment(stateTS).format("HH:mm:ss");
  const EndDateStr = moment(endTS).format("YYYY+MM+DD");
  const EndTimeStr = moment(endTS).format("HH:mm:ss");
  const eventInfo = {
    StartDateStr,
    StartTimeStr,
    EndDateStr,
    EndTimeStr,
    AllDay: allDay
  };
  dispatchEventToFm("NewEventFromSelected", eventInfo);
};
