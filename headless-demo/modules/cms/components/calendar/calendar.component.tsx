import React from "react";
import { CalendarProps } from "./calendar.type";
import Calendar from "@ericz1803/react-google-calendar";

const API_KEY = "AIzaSyB0iePPNS-C5zYkqjsym2gRuTANri-Sxsk";
let calendars = [
  {calendarId: "YOUR_CALENDAR_ID"},
  {
    calendarId: "YOUR_CALENDAR_ID_2",
    color: "#B241D1" //optional, specify color of calendar 2 events
  }
];

class Example extends React.Component {
  render() {
    return (
      <div>
        <Calendar apiKey={API_KEY} calendars={calendars} />
      </div>
    )
  }
}

export const CalendarComponent: React.FC<CalendarProps> = ({
    url,
    alt
}) => {
    return (
        <section className="calendar-section" >
        <div className="liner">
                <a href={url} download>Download the Academic Calendar »</a>
          </div>
      </section>
    )
}