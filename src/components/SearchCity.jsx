import React, { useEffect, useRef, useState } from "react";
import { searchCities } from "../services/weather";

export default function SearchCity({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const data = await searchCities(q, 8);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer.current);
  }, [q]);

  return (
    <div className="search-wrap">
      <input
        className="input"
        placeholder="Buscar"
        value={q}
        onChange={e => setQ(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
      />
      {open && (
        <div className="dropdown">
          {results.map(r => (
            <div
              key={r.id}
              className="option"
              onMouseDown={() => {
                onSelect({ name: r.label, latitude: r.latitude, longitude: r.longitude });
                setQ(r.label);
                setOpen(false);
              }}
            >
              {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
