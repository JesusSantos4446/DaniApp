// src/components/WeatherList.jsx
import React, { useEffect, useState } from "react";
import { fetchHourlyWeather } from "../services/weather";
import WeatherItem from "./WeatherItem";

export default function WeatherList({ city }) {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const data = await fetchHourlyWeather(city);
        if (alive) setHours(data);
      } catch (e) {
        if (alive) setErr(e?.message || "Unknown error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [city.latitude, city.longitude]);

  if (loading) return <div className="card">Cargando clima…</div>;
  if (err) return <div className="card" style={{ color: "crimson" }}>Error: {err}</div>;

  return (
    <div className="hours-wrap">
      <ul className="hours">
        {hours.map(h => <WeatherItem key={h.iso} hour={h} />)}
      </ul>
    </div>
  );
}
