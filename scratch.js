const config = require("./src/configuration.json");

let x = Object.entries(config).sort((a, b) => {
  return a[1].sort - b[1].sort;
});

console.log(x);
