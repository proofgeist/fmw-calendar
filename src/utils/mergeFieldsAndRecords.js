import moment from "moment";

/**
 * combine the names of the fields with an array arrays
 * @param {array} fields an array of fields
 * @param {array} records an array of arrays
 * @return {array}
 */
export default function(fields, records) {
  return records.map(record => {
    const obj = {};
    record.forEach((value, i) => {
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
  });
}
