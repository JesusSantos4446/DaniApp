import React, { useEffect, useState } from "react";
import { fetchDailyWeather } from "../services/weather";

const iconFor = (code, isDay) => {
  if ([0].includes(code)) return isDay ? "☀️" : "🌙";
  if ([1, 2].includes(code)) return isDay ? "🌤️" : "🌙☁️";
  if ([3].includes(code)) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return isDay ? "☀️" : "🌙";
};

const dayLabel = (iso, idx) => {
  if (idx === 0) return "Hoy";
  return new Date(iso).toLocaleDateString("es-ES", { weekday: "short" });
};

export default function WeeklyForecastList({ city }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const data = await fetchDailyWeather(city); 
        if (alive) setDays(data.slice(0, 7));
      } catch (e) {
        if (alive) setErr(e?.message || "Unknown error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [city.latitude, city.longitude]);

  if (loading) return null;
  if (err) return <div style={{ color: "crimson" }}>Error: {err}</div>;

  return (
    <ul className="week-list">
      {days.map((d, i) => (
        <li key={d.date} className="week-row">
          <div className="col-day">{dayLabel(d.date, i)}</div>

          <div className="col-rain">
            <span className="drop">💧</span>
            <span className="rain-text">{d.precip ?? 0}%</span>
          </div>

          <div className="col-icons">
            <span>{iconFor(d.code, true)}</span>
            <span>{iconFor(d.code, false)}</span>
          </div>

          <div className="col-temps">
            <span className="tmax">{Math.round(d.max)}°</span>
            <span className="tmin">{Math.round(d.min)}°</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
