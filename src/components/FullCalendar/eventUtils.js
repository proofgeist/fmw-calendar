import moment from "moment";
import { fmFetch, fmCallScript } from "fmw-utils";

const PROPERTIES = ["id", "title", "editable", "start", "end", "allDay"];

export function getConfig(prop) {
  const { Config } = window.fmw.getInitialProps();
  return Config[prop];
}

export function getFMFieldName(propName) {
  const FieldNames = getConfig("FieldNames");
  const FieldNamesArray = FieldNames.split("\r");

  let i = PROPERTIES.findIndex(el => {
    return el === propName;
  });
  return FieldNamesArray[i];
}

/**
 * fetch events from FileMaker
 * @param {object} fetchInfo the
 * @param {Date} fetchInfo.start the start from search date
 * @param {Date} fetchInfo.end the end from search date
 */
export function fetchEvents(fetchInfo) {
  const { select, startField, endField } = createFieldSelect();
  const { start, end } = fetchInfo;
  const startStr = moment(start).format("L") + " 00:00:00";
  const endStr =
    moment(end)
      .add(1, "days")
      .format("L") + " 00:00:00";
  const sql = `${select} WHERE ${startField} >= '${startStr}' AND ${endField} < '${endStr}'`;

  return fmFetch(
    "Handle Calender Event",
    {
      sql,
      start,
      end
    },
    { eventType: "GetData" }
  );
}

export function newEventFetcher() {
  return fetchInfo => fetchEvents(fetchInfo);
}

function createFieldSelect() {
  function quoteField(field) {
    const split = field.split("::");
    return `"${split[0]}"."${split[1]}"`;
  }

  const { Config } = window.fmw.getInitialProps();
  const { FieldNames, CalendarTable } = Config;
  let fieldArray = FieldNames.split("\r");

  let fieldSelectArray = fieldArray.map(field => {
    return quoteField(field);
  });

  const startField = quoteField(fieldArray[3]);
  const endField = quoteField(fieldArray[4]);

  const fieldSelect = fieldSelectArray.join(", ");
  return {
    select: `SELECT ${fieldSelect} FROM ${CalendarTable}`,
    startField,
    endField
  };
}

/**
 * fullcalendar event fetcher
 * @param {array} eventArray an array of values for the event
 */
export function transformEvent(eventArray) {
  const fields = PROPERTIES;
  const obj = {};
  eventArray.forEach((value, i) => {
    const prop = fields[i];
    if (prop === "allDay") {
      value = value !== "1" ? false : true;
    }
    if (prop === "start") {
      value = moment(value).toDate();
    }
    if (prop === "editable") {
      value = value === "1" ? true : false;
    }
    if (prop === "end") {
      value = moment(value).toDate();
    }
    obj[prop] = value;
  });
  return obj;
}

export function dispatchEventToFm(EventType, data) {
  const options = {
    eventType: EventType
  };

  fmCallScript("Handle Calender Event", data, options);
}
