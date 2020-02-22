import moment from "moment";
import { fmCallScript, getFMFieldName } from "fmw-utils";
import { findRecords } from "../../api";

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
    .subtract(1, "month")
    .format("L");
  const endStr = moment(end)
    .add(1, "month")
    .format("L");

  const startFieldName = getFMFieldName("EventStartField");
  const endFieldName = getFMFieldName("EventEndField");

  const request = {
    layouts: Config.EventDetailLayout.value,
    query: [
      { [startFieldName]: `>=${startStr}`, [endFieldName]: `<${endStr}` }
    ],
    limit: 300
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
  let start = fieldData[getFMFieldName("EventStartField")];
  start = moment(start).toDate();
  let end = fieldData[getFMFieldName("EventEndField")];
  end = moment(end).toDate();
  let allDay = fieldData[getFMFieldName("EventAllDayField")];
  allDay = allDay ? 1 : 0;
  let editable = fieldData[getFMFieldName("EventEditableField")];
  editable = editable ? 1 : 0;
  const event = { id, start, title, end, allDay, editable };
  return event;
}

export function dispatchEventToFm(EventType, data) {
  const options = {
    eventType: EventType
  };
  fmCallScript("FCCalenderEvents", data, options);
}

export const getConfig = () => {};
