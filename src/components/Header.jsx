// src/components/Header.jsx
import React from "react";
import { reverseGeocode } from "../services/geocode";
import { useTheme } from "../context/ThemeContext";
import SearchCity from "./SearchCity";

export default function Header({ city, onCityChange }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // 🔹 Botón: usar la ubicación actual del usuario
  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        (async () => {
  const realCity = await reverseGeocode(latitude, longitude);
  onCityChange(realCity);
})();
      },
      () => alert("No se pudo obtener tu ubicación")
    );
  };

  return (
    <header className="header" style={{ gap: "1rem" }}>
      {/* Título: nombre de la ciudad */}
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: "1.25rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {city?.name || "Ciudad"}
        </h1>
      </div>

      {/* Centro: buscador */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          flex: 1,
          maxWidth: 560,
        }}
      >
        <div style={{ flex: 1 }}>
          <SearchCity onSelect={onCityChange} />
        </div>
      </div>

      {/* Botón: ubicación actual */}
      <button
        className="btn"
        onClick={handleUseLocation}
        title="Usar ubicación actual"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: ".5rem .8rem",
        }}
      >
        {/* Ícono de localización */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#29b6f6"
          viewBox="0 0 24 24"
        >
          <path d="M12 2a1 1 0 0 1 1 1v1.05A8.004 8.004 0 0 1 20.95 11H22a1 1 0 1 1 0 2h-1.05A8.004 8.004 0 0 1 13 20.95V22a1 1 0 1 1-2 0v-1.05A8.004 8.004 0 0 1 3.05 13H2a1 1 0 1 1 0-2h1.05A8.004 8.004 0 0 1 11 3.05V2a1 1 0 0 1 1-1Zm0 5a5 5 0 1 0 0 10a5 5 0 0 0 0-10Z" />
        </svg>
      </button>

      {/* Botón: modo claro/oscuro */}
      <button
        className="btn"
        onClick={toggleTheme}
        title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: ".5rem .8rem",
        }}
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#FFD54F"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1ZM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0 2.5a1 1 0 0 1 1 1V21a1 1 0 1 1-2 0v-.5a1 1 0 0 1 1-1ZM4.5 12a1 1 0 0 1 1-1H7a1 1 0 1 1 0 2H5.5a1 1 0 0 1-1-1ZM17 11a1 1 0 1 1 0 2h1.5a1 1 0 1 1 0-2H17Zm-8.95 6.36a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM15.48 5.64a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L15.48 7.05a1 1 0 0 1 0-1.41ZM5.64 8.52a1 1 0 1 1 1.41-1.41L8.11 8.17a1 1 0 1 1-1.41 1.41L5.64 8.52Zm10.83 7.31a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#4FC3F7"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
          </svg>
        )}
      </button>
    </header>
  );
}
