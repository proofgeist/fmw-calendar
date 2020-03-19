import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { init } from "fmw-utils";

import "./themed-bootstrap.css";
import "./index.css";
import Widget from "./Widget";

function BootWidget(props) {
  ReactDOM.render(<Widget {...props} />, document.getElementById("root"));
}

//this function is run via the body's onload attribute
//<body onload="fmwInit()">
window.fmwInit = function fmwInit() {
  init(BootWidget);
};
