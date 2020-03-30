import moment from "moment";
import { fmCallScript, getFMFieldName, getConfig } from "fmw-utils";
import { findRecords } from "../../api";
import theme from "./event.themes";

/**
 * TODO move to new file
 * @param {} request
 */

/**
 * fetch events from FileMaker
 * @param {object} fetchInfo the
 * @param {Date} fetchInfo.start the start from search date
 * @param {Date} fetchInfo.end the end from search date
 */
export async function fetchEvents(fetchInfo, Config) {
  const { start, end } = fetchInfo;

  const startStr = moment(start)
    .subtract(2, "days")
    .format("YYYY+MM+DD");
  const endStr = moment(end)
    .add(2, "days")
    .format("YYYY+MM+DD");

  const startFieldName = getFMFieldName("EventStartDateField");
  const endFieldName = getFMFieldName("EventEndDateField");

  const request = {
    layouts: Config.EventDetailLayout.value,
    query: [
      { [startFieldName]: `>=${startStr}`, [endFieldName]: `<${endStr}` }
    ],
    limit: 3000
  };
  const response = await findRecords(request);

  return response.data;
}

export function newEventFetcher(Config) {
  return fetchInfo => fetchEvents(fetchInfo, Config);
}

function fmTimeStamp(dateString, timeString) {
  const firstFour = dateString.substring(0, 4);
  let format;
  if (firstFour.includes("/")) {
    format = "MM/DD/YYYYTHH:mm:ss";
  } else {
    format = "YYYY/MM/DDTHH:mm:ss";
  }
  const ts = dateString + "T" + timeString;
  return moment(ts, format).toDate();
}

/**
 * fullcalendar event fetcher
 * @param {array} fmEventRecord an the fmRecordObject for the event
 */
export function transformEvent(fmEventRecord) {
  const fieldData = fmEventRecord.fieldData;
  const id = fieldData[getFMFieldName("EventPrimaryKeyField")];
  const title = fieldData[getFMFieldName("EventTitleField")];

  let startDate = fieldData[getFMFieldName("EventStartDateField")];
  let startTime = fieldData[getFMFieldName("EventStartTimeField")];
  let start = fmTimeStamp(startDate, startTime);

  let endDate = fieldData[getFMFieldName("EventEndDateField")];
  let endTime = fieldData[getFMFieldName("EventEndTimeField")];
  let end = fmTimeStamp(endDate, endTime);

  const descriptionFieldName = getFMFieldName("EventDescriptionField");
  let description = "";
  if (descriptionFieldName) {
    description = fieldData[descriptionFieldName];
  }

  const allDayFieldName = getFMFieldName("EventAllDayField");
  let allDay = 0;
  if (allDayFieldName) {
    allDay = fieldData[allDayFieldName];
    allDay = allDay ? 1 : 0;
  }

  const editableFieldName = getFMFieldName("EventEditableField");
  let editable = 1;
  if (editableFieldName) {
    editable = fieldData[editableFieldName];
    editable = editable ? 1 : 0;
  }

  const eventStyleFieldName = getFMFieldName("EventStyleField");
  let eventStyle = "";
  if (eventStyleFieldName) {
    eventStyle = fieldData[eventStyleFieldName];
  }
  const styleObj = getStyle(eventStyle);

  const event = {
    id,
    start,
    title,
    description,
    end,
    allDay,
    editable,
    ...styleObj
  };

  return event;
}

export function dispatchEventToFm(EventType, data) {
  const options = {
    eventType: EventType
  };
  fmCallScript("FCCalendarEvents", data, options);
}

function getStyle(eventStyle) {
  if (!eventStyle) return;

  try {
    eventStyle = JSON.parse(eventStyle);
  } catch (e) {
    eventStyle = theme(eventStyle);
  }
  return eventStyle;
}

export function getFirstDay() {
  let firstDayName = getConfig("StartOnDay").toLowerCase();
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  let i = days.findIndex(i => {
    return i === firstDayName;
  });

  if (!i) return 0; //sunday
  return i;
}
