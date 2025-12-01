import React from "react";

const CITIES = [
  { name: "CDMX, MX", latitude: 19.4326, longitude: -99.1332 },
  { name: "Monterrey, MX", latitude: 25.6866, longitude: -100.3161 },
  { name: "Guadalajara, MX", latitude: 20.6597, longitude: -103.3496 },
  { name: "Madrid, ES", latitude: 40.4168, longitude: -3.7038 },
  { name: "Buenos Aires, AR", latitude: -34.6037, longitude: -58.3816 },
];

export default function CityPicker({ value, onChange }) {
  return (
    <select
      className="select"
      value={value.name}
      onChange={(e) => {
        const city = CITIES.find(c => c.name === e.target.value);
        if (city) onChange(city);
      }}
    >
      {CITIES.map(c => (
        <option key={c.name} value={c.name}>{c.name}</option>
      ))}
    </select>
  );
}

export { CITIES };
