import { getConfig } from "fmw-utils";

export function buildDefaults(Config) {
  const obj = {};
  Object.keys(Config).forEach(c => {
    obj[c] = Config[c].value;
  });
  return obj;
}
