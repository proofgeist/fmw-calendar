import React from "react";
import { Col, Row } from "reactstrap";

import {
  ConfigMenu,
  ConfigMenuItem,
  ConfigContent,
  MiniPage,
  Control
} from "./lib/Configuration";

export default function({ menuProps, currentNav, proper }) {
  return (
    <>
      <ConfigMenu>
        <ConfigMenuItem
          {...menuProps}
          link="required"
          label="Required"
          fieldsToTrackErrorsArray={[
            "EventDetailLayout",
            "EventPrimaryKeyField",
            "EventTitleField",
            "EventStartDateField",
            "EventStartTimeField",
            "EventEndDateField",
            "EventEndTimeField"
          ]}
        />
        <ConfigMenuItem
          {...menuProps}
          link="additional-fields"
          label="Optional Fields"
          fieldsToTrackErrorsArray={[
            "EventDescriptionField",
            "EventAllDayField",
            "EventEditableField",
            "EventStyleField"
          ]}
        />
        <ConfigMenuItem
          {...menuProps}
          link="filter"
          label="Filter"
          fieldsToTrackErrorsArray={[
            "EventFilterQueryField",
            "EventFilterField"
          ]}
        />
        <ConfigMenuItem
          {...menuProps}
          link="calendar-settings"
          label="Other"
          fieldsToTrackErrorsArray={[
            "DefaultEventStyle",
            "StartOnDay",
            "EventFilterField",
            "StartingView"
          ]}
        />
      </ConfigMenu>

      <ConfigContent>
        <MiniPage current={currentNav} name="required">
          <h4>Required Options</h4>
          <Control {...proper("EventDetailLayout")}></Control>
          <Control {...proper("EventPrimaryKeyField")}></Control>
          <Control {...proper("EventTitleField")}></Control>
          <Control {...proper("EventStartDateField")}></Control>
          <Control {...proper("EventStartTimeField")}></Control>
          <Control {...proper("EventEndDateField")}></Control>
          <Control {...proper("EventEndTimeField")}></Control>
        </MiniPage>
        <MiniPage current={currentNav} name="additional-fields">
          <h4>Additional Optional Fields</h4>
          <Control {...proper("EventDescriptionField")}></Control>
          <Control {...proper("EventAllDayField")}></Control>
          <Control {...proper("EventEditableField")}></Control>
          <Control {...proper("EventStyleField")}></Control>
        </MiniPage>
        <MiniPage current={currentNav} name="filter">
          <h4>Filtering Events</h4>
          <Control {...proper("EventFilterQueryField")}></Control>
          <Control {...proper("EventFilterField")}></Control>
        </MiniPage>
        <MiniPage current={currentNav} name="calendar-settings">
          <h4>Other Settings</h4>
          <Control {...proper("DefaultEventStyle")}></Control>
          <Row>
            <Col>
              <Control {...proper("StartOnDay")}></Control>
            </Col>
            <Col>
              <Control {...proper("StartingView")}></Control>
            </Col>
          </Row>
        </MiniPage>
      </ConfigContent>
    </>
  );
}
