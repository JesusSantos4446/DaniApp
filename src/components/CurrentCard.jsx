import React from "react";

export default function CurrentCard({ current }) {
  if (!current) return null;
  return (
    <div className="card current">
      <div>
        <h3 style={{ marginTop: 0 }}>Clima actual</h3>
        <div style={{ fontSize: "2rem", fontWeight: 700 }}>
          {Math.round(current.temperature)}°C
          <span className="badge" style={{ marginLeft: 8 }}>
            {current.weather_text}
          </span>
        </div>
        <div style={{ marginTop: 6 }}>
          Sensación: {Math.round(current.feels_like)}°C · Humedad: {Math.round(current.humidity)}% · Viento: {Math.round(current.wind_kmh)} km/h
        </div>
      </div>
    </div>
  );
}
