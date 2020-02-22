import React, { useState, useEffect } from "react";
import reactCSS from "reactcss";
import { useForm } from "react-hook-form";
import { SketchPicker } from "react-color";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { fmFetch } from "fmw-utils";

import "react-day-picker/lib/style.css";
// import MomentLocaleUtils, {
//   formatDate,
//   parseDate,
// } from 'react-day-picker/moment';

// import dateFnsFormat from 'date-fns/format';
// import dateFnsParse from 'date-fns/parse';

// implement react color picker
// implement date pickers

function Configrator({
  Config,
  AddonUUID,
  headerText,
  topWidth,
  saveToFM,
  onCancelConfigurator
}) {
  const [initialProps, setInitialProps] = useState({ fields: Config });
  const { fields } = initialProps;

  const { register, handleSubmit, watch, errors, getValues } = useForm();
  const onSubmit = data => {
    //console.log("ON SUBMIT...", data, form);
    let finalObject = Object.assign({}, data, form);

    const config = JSON.parse(JSON.stringify(fields));
    //add current form state back to config
    Object.keys(config).forEach(key => {
      config[key].value = finalObject[key];
    });

    saveToFM(config);
  };
  const [form, setState] = useState(buildInitStateObject(fields));

  /**
   *
   */
  async function scanSchema() {
    const currentData = getValues();

    //clone
    const config = JSON.parse(JSON.stringify(fields));
    //add current form state back to config
    Object.keys(config).forEach(key => {
      config[key].value = currentData[key];
    });

    console.log("CUURENT", config);

    const newConfig = await fmFetch("FCCalendarSchema", config);

    console.log("ccomback", newConfig);

    setInitialProps({ fields: newConfig });
  }

  useEffect(() => {
    scanSchema();
  }, [Config, AddonUUID]);

  function buildInitStateObject(fields) {
    //console.log("BUILD STATE OBJECT", fields);
    let n = {},
      f = Object.entries(fields);
    for (let i = 0; i < f.length; i++) {
      n[f[i][0]] = fields[f[i][0]].value;
    }
    return n;
  }

  // useEffect(() =>
  // { console.log("use effect fired");
  //   //formHandler = buildFormHandler(fields);
  // }
  // )

  function checkSubmit(v1, v2) {
    console.log("check submit", v1, v2);
  }

  const getColorObject = color => {
    //console.log("getColorObject", color, typeof color, checkColorValue(color));
    if (typeof color === "object") {
      return color;
    } else {
      if (typeof color === "string" && color.slice(0, 1) === "#") {
        return checkColorValue(color);
      }
    }
  };

  function onChange(v1, v2) {
    const name = v1.target.name;

    const fieldConfig = fields[name];
    if (fieldConfig.reScanOnChange) {
      scanSchema();
    }

    //console.log(v1, typeof v1, v1.nativeEvent);
    if (v1.nativeEvent && v1.nativeEvent.inputType === "insertText") {
      //console.log("insertText", v1.target.name, v1.nativeEvent.srcElement.value, v1, v1.target);
    } else {
      if (v1.hasOwnProperty("target")) {
        //console.log("target", v1.target.name, v1.nativeEvent.srcElement.value,
        //v1, v1.target, v1.nativeEvent.srcElement.checked, v1.nativeEvent.inputType );
      } else {
        //console.log("Date?", v1, new Date(v1), v1.getUTCHours);
      }
    }
    if (
      !v1.nativeEvent ||
      !v1.nativeEvent.srcElement.hasOwnProperty("checked")
    ) {
      setState({ ...form, [v1.target.name]: v1.target.value });
    } else {
      setState({
        ...form,
        [v1.target.name]: v1.nativeEvent.srcElement.checked
      });
    }
  }

  const checkBool = val => {
    let tf = Boolean(val);
    if (typeof val === "string") {
      // console.log("boolean", Boolean(val).toString());
    }
    return Boolean(val).toString(); //((tf)?("true"):("false"));
  };

  return (
    <div className="containerTop" style={{ width: `${topWidth}` }}>
      <div className="menuHeader">{headerText}</div>

      <div className="configHolder">
        <div className="configScroller">
          <form onSubmit={handleSubmit(onSubmit)}>
            {Object.entries(fields)
              .sort((a, b) => {
                return a[1].sort - b[1].sort;
              })
              .map((item, v) => (
                <div key={v} className="formRow">
                  <label
                    key={"label_" + v}
                    htmlFor={item[0]}
                    className="fieldLabel"
                  >
                    {fields[item[0]].label}
                  </label>
                  <>
                    {
                      {
                        color: (
                          <SketchWithSwatch
                            position="top-left"
                            key={`form_field_${v}`}
                            color={getColorObject(form[item[0]])}
                            onChangeComplete={(color, event) =>
                              onChange({
                                nativeEvent: {
                                  inputType: "color",
                                  srcElement: { value: color }
                                },
                                target: { name: item[0], value: color }
                              })
                            }
                          ></SketchWithSwatch>
                        ),
                        select: (
                          <div key={`form_field_${v}`} className="inputTop">
                            <select
                              key={"input_" + v}
                              multiple={
                                fields[item[0]].multiple
                                  ? fields[item[0]].multiple
                                  : false
                              }
                              value={form[item[0]]}
                              ref={register}
                              if={item[0]}
                              name={item[0]}
                              onChange={onChange}
                            >
                              <option
                                key={"option___top"}
                                value=""
                                disabled
                                selected
                              >
                                Select
                              </option>
                              {fields[item[0]].options &&
                              fields[item[0]].options.length > 0
                                ? fields[item[0]].options.map((item, idx) =>
                                    typeof item === "object" ? (
                                      <option
                                        key={`option_${idx}`}
                                        value={item.value}
                                      >
                                        {item.displayText}
                                      </option>
                                    ) : (
                                      <option
                                        key={`option_${idx}`}
                                        value={item}
                                      >
                                        {item}
                                      </option>
                                    )
                                  )
                                : ""}
                            </select>
                          </div>
                        ),
                        "color-max": (
                          <SketchPicker
                            key={`form_field_${v}`}
                            color={getColorObject(form[item[0]])}
                            onChangeComplete={(color, event) =>
                              onChange({
                                nativeEvent: {
                                  inputType: "color",
                                  srcElement: { value: color }
                                },
                                target: { name: item[0], value: color }
                              })
                            }
                          ></SketchPicker>
                        ),
                        //"color" : <SketchWithSwatch key={`form_field_${v}`} color={getColorObject(form[item[0]])} onChangeComplete={(color, event) => onChange({ nativeEvent : { inputType : "color", srcElement : { value : color } }, target : { name : item[0], value : color } })}></SketchWithSwatch>,
                        "date-cal": <DayPicker key={`form_field_${v}`} />,
                        date: (
                          <div key={`form_field_${v}`} className="inputTop">
                            <DayPickerInput
                              placeholder={form[item[0]]}
                              onDayChange={d =>
                                onChange({
                                  nativeEvent: {
                                    inputType: "date",
                                    srcElement: { value: d }
                                  },
                                  target: { name: item[0], value: d }
                                })
                              }
                            />
                          </div>
                        ),
                        text: (
                          <div key={`form_field_${v}`} className="inputTop">
                            <input
                              key={"input_" + v}
                              ref={register}
                              type={fields[item[0]].type}
                              onChange={onChange}
                              name={item[0]}
                              id={item[0]}
                              value={form[item[0]]}
                            />
                          </div>
                        ),
                        checkbox: (
                          <div key={`form_field_${v}`} className="inputTop">
                            <input
                              key={"input_" + v}
                              ref={register}
                              type={fields[item[0]].type}
                              onChange={onChange}
                              name={item[0]}
                              id={item[0]}
                              checked={form[item[0]]}
                              value={form[item[0]]}
                            />
                          </div>
                        ),
                        boolean: (
                          <div key={`form_field_${v}`} className="inputTop">
                            <input
                              key={"input_" + v}
                              ref={register}
                              type={"checkbox"}
                              onChange={onChange}
                              name={item[0]}
                              id={item[0]}
                              checked={form[item[0]]}
                              value={form[item[0]]}
                            />
                          </div>
                        )
                      }[fields[item[0]].type]
                    }
                  </>
                  <>
                    {item[1].help ? (
                      <div className="helpText">{item[1].help}</div>
                    ) : (
                      ""
                    )}
                  </>
                </div>
              ))}
            <div className="formRow">
              <input className={"submitButton"} type="submit" value="Save" />
            </div>
            <div onClick={onCancelConfigurator}>cancel</div>
          </form>
        </div>
      </div>
    </div>
  );
}

//<RenderFields />

export default Configrator;

// const RenderFields = () => {
//   return (
//   <><form onSubmit={handleSubmit(onSubmit)}>{
//       Object.entries(fields).map(
//       (item, v)=>(
//         <div key={v} className="formRow">
//           <label key={"label_" + v} htmlFor={item[0]}>{fields[item[0]].name}
//             { (fields[item[0]].type !== "select")
//               ?(<input key={"input_" + v} ref={register} type={fields[item[0]].type} onChange={onChange} name={item[0]} id={item[0]} value={form[item[0]]} />)
//               :(<select key={"input_" + v} value={form[item[0]]} ref={register} if={item[0]} name={item[0]} onChange={onChange}>
//                 { fields[item[0]].options.map(item => (<option value={item.value}>{item.displayText}</option>)) }
//                 </select>)
//             }</label>
//           </div>)
//       )
//   }
//   <div className="formRow"><input type="submit" /></div>
//   </form></>)
// }

function checkColorValue(iColor) {
  //console.log("CHECK COLOR VALUE", iColor, typeof iColor, iColor.length);

  const type = typeof iColor;
  let co = { rgb: {}, hex: "" };
  if (type === "string" && iColor.length === 7) {
    //console.log("setting vals...");
    co.hex = iColor;
    co.rgb.r = parseInt(iColor.substr(1).substr(0, 2), 16);
    co.rgb.g = parseInt(iColor.substr(1).substr(2, 2), 16);
    co.rgb.b = parseInt(iColor.substr(1).substr(4, 2), 16);
    co.rgb.a = 100;
    //console.log("ABOUT TO RETURN", co);
    return co;
  }
  return iColor;
}

function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  // later : upgrade this to return a format, leverage for checkColorValue
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
}

function SketchWithSwatch({ color, onChangeComplete }) {
  const [displayColorPicker, toggleDisplay] = useState(false);
  const [colorSet, changeColor] = useState(color);

  //console.log("SketchWithSwatch COLORS", colorSet, color, colorSet == color);

  if (colorSet !== color) {
    changeColor(color);
  }

  function handleComplete(color) {
    changeColor(color);
    onChangeComplete(color);
  }

  let styles = cc =>
    reactCSS({
      default: {
        color: {
          width: "23px",
          height: "11px",
          borderRadius: "1px",
          background: `rgba(${cc.rgb.r}, ${cc.rgb.g}, ${cc.rgb.b}, ${cc.rgb.a})`
        },
        swatch: {
          padding: "2px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

  const position = displayColorPicker ? "fixed" : "relative";

  return (
    <div className="colorHolderTop">
      <div style={{ position: position }}>
        <div
          style={styles(checkColorValue(colorSet)).swatch}
          onClick={() => toggleDisplay(true)}
        >
          <div style={styles(checkColorValue(colorSet)).color} />
        </div>
        {displayColorPicker ? (
          <div style={styles(checkColorValue(colorSet)).popover}>
            <div
              style={styles(checkColorValue(colorSet)).cover}
              onClick={() => toggleDisplay(false)}
            />
            <SketchPicker
              color={checkColorValue(colorSet)}
              onChangeComplete={handleComplete}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
