import { dispatchEventToFm, getFMFieldName, getConfig } from "./eventUtils";
import moment from "moment";

const handleDoubleClick = event => {
  const idFieldName = getFMFieldName("id");
  const eventDisplayLayout = getConfig("CalendarEventLayout");

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
  const endFieldName = getFMFieldName("end");
  const idFieldName = getFMFieldName("id");
  const newEndTimeStamp = moment(end).format("L LTS");
  const eventDisplayLayout = getConfig("CalendarEventLayout");
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
  const idFieldName = getFMFieldName("id");
  const startFieldName = getFMFieldName("start");
  const endFieldName = getFMFieldName("end");
  const eventDisplayLayout = getConfig("CalendarEventLayout");
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
