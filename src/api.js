import { fmFetch } from "fmw-utils";

/**
 * find records in the database
 * @param {Object} request
 * @param {String} request.layouts  the name of the layout to do the find on
 * @param {String} request.layout.response  the name of the layout to get the response from (watch the period)
 * @param {Array} request.query an array of data api queries
 * @param {Array} [request.sort] an array of sorts
 * @param {Number} [request.offset] for paging
 * @param {Number} [request.limit] for paging
 */
export const findRecords = request => {
  return fmFetch("FCCalendarFind", request).then(result => {
    return responseParse(result);
  });
};

export function responseParse(result) {
  if (result.messages[0].code === "401") {
    return { data: [] };
  }

  return {
    ok: (result.messages[0].code = 0 ? true : false),
    data: result.response.data,
    database: result.response.dataInfo.database,
    layout: result.response.dataInfo.layout,
    table: result.response.dataInfo.table
  };
}
