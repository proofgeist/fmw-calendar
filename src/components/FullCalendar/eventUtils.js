import moment from "moment";
import { fmCallScript, getFMFieldName } from "fmw-utils";
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
    .format("L");
  const endStr = moment(end)
    .add(2, "days")
    .format("L");

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

/**
 * fullcalendar event fetcher
 * @param {array} fmEventRecord an the fmRecordObject for the event
 */
export function transformEvent(fmEventRecord) {
  const fieldData = fmEventRecord.fieldData;
  const id = fieldData[getFMFieldName("EventPrimaryKeyField")];
  const title = fieldData[getFMFieldName("EventTitleField")];
  const description = fieldData[getFMFieldName("EventDescriptionField")];
  let startDate = fieldData[getFMFieldName("EventStartDateField")];
  let startTime = fieldData[getFMFieldName("EventStartTimeField")];
  let start = moment(startDate + " " + startTime).toDate();
  let endDate = fieldData[getFMFieldName("EventEndDateField")];
  let endTime = fieldData[getFMFieldName("EventEndTimeField")];
  let end = moment(endDate + " " + endTime).toDate();
  let allDay = fieldData[getFMFieldName("EventAllDayField")];
  allDay = allDay ? 1 : 0;
  let editable = fieldData[getFMFieldName("EventEditableField")];
  editable = editable ? 1 : 0;

  const eventStyle = fieldData[getFMFieldName("EventStyleField")];
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
  fmCallScript("FCCalenderEvents", data, options);
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
