import React from "react";
import { iconFor } from "../services/weather";

export default function WeatherItem({ hour }) {
  const dt = new Date(hour.iso);
  const h = dt.toLocaleString(undefined, { hour: "numeric" }); 
  const isNight = dt.getHours() < 6 || dt.getHours() >= 18;

  return (
    <li className="hour">
      <div className="hour-time">{h}</div>
      <div className="hour-icon" aria-label={String(hour.code)}>
        {iconFor(hour.code, isNight)}
      </div>
      <div className="hour-temp">{Math.round(hour.temp)}°</div>
      <div className="hour-pop">
        <span className="drop">💧</span> {Math.round(hour.pop || 0)}%
      </div>
    </li>
  );
}
