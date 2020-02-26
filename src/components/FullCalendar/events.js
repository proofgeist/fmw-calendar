import { dispatchEventToFm } from "./eventUtils";
import { getConfig } from "fmw-utils";
import moment from "moment";

const handleDoubleClick = event => {
  const idFieldName = getConfig("EventPrimaryKeyField");
  const eventDisplayLayout = getConfig("EventDetailLayout");

  dispatchEventToFm("EventClick", {
    id: event.event.id,
    eventDisplayLayout,
    idFieldName
  });
};

export const eventRender = event => {
  // we need to do our own event handler here, to do doubleclick
  event.el.addEventListener("dblclick", () => {
    handleDoubleClick(event);
  });
};

export const handleEventResize = ({ event }) => {
  const { id, end } = event;
  const endFieldName = getConfig("EventEndField");
  const idFieldName = getConfig("EventPrimaryKeyField");
  const newEndTimeStamp = moment(end).format("L LTS");
  const eventDisplayLayout = getConfig("EventDetailLayout");
  dispatchEventToFm("EventResized", {
    id,
    newEndTimeStamp,
    idFieldName,
    endFieldName,
    eventDisplayLayout
  });
};

export const handleEventDrop = event => {
  const oldEvent = event.oldEvent;
  const oldStart = oldEvent.start;
  const oldEnd = oldEvent.end;
  const delta = event.delta;
  const idFieldName = getConfig("EventPrimaryKeyField");
  const startFieldName = getConfig("EventStartField");
  const endFieldName = getConfig("EventEndField");
  const eventDisplayLayout = getConfig("EventDetailLayout");
  //calc new Format in the FM format for this local
  const newStartTimeStamp = moment(oldStart)
    .add(delta)
    .format("L LTS");
  const newEndTimeStamp = moment(oldEnd)
    .add(delta)
    .format("L LTS");

  dispatchEventToFm("EventDropped", {
    newStartTimeStamp,
    id: event.event.id,
    startFieldName,
    idFieldName,
    endFieldName,
    newEndTimeStamp,
    eventDisplayLayout
  });
};

export const handleEventSelect = selectInfo => {
  const { allDay, end: endTS, start: stateTS } = selectInfo;

  const startDateStr = moment(stateTS).format("L");
  const startTimeStr = moment(stateTS).format("LTS");
  const endDateStr = moment(endTS).format("L");
  const EndTimeStr = moment(endTS).format("LTS");
  const eventInfo = {
    startDateStr,
    startTimeStr,
    endDateStr,
    EndTimeStr,
    allDay
  };

  console.log(eventInfo);
};
