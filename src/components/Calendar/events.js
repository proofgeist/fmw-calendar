export function onDateClick({ dateStr, date }) {
  //TODO convert this to FM format
  window.FileMaker.PerformScript("TEST", dateStr);
}

export function onSelectDate({ startStr, endStr }) {
  //TODO convert this to FM format
  window.FileMaker.PerformScript("SELECT DATES", endStr + "-" + endStr);
}
