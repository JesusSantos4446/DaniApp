import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { reverseGeocode } from "./services/geocode";
import Header from "./components/Header";
import WeatherList from "./components/WeatherList";
import CurrentCard from "./components/CurrentCard";
import { fetchCurrentWeather } from "./services/weather";
import { CITIES } from "./components/CityPicker";
import WeeklyForecast from "./components/WeeklyForecast";

// nuevos componentes
import Login from "./components/Login";
import Home from "./components/Home";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("menu"); // "menu" | "clima"

  // ciudad actual (se llenará con geolocalización o búsqueda)
  const [city, setCity] = useState(null);
  const [current, setCurrent] = useState(null);

  const [loadingCity, setLoadingCity] = useState(false);
  const [cityError, setCityError] = useState("");

  // 🔹 Obtener ciudad basada en geolocalización cuando entras a "clima"
  useEffect(() => {
    if (!isLogged || view !== "clima") return;

    // si ya hay ciudad (por búsqueda o botón), no volvemos a pedirla
    if (city) return;

    setLoadingCity(true);
    setCityError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
       (async () => {
  const realCity = await reverseGeocode(latitude, longitude);
  setCity(realCity);
})();
        setLoadingCity(false);
      },
      () => {
        // si falla, usamos una ciudad por defecto
        setCity(CITIES[1]);
        setCityError("No se pudo obtener tu ubicación, usando ciudad por defecto.");
        setLoadingCity(false);
      }
    );
  }, [isLogged, view, city]);

  // 🔹 Pedir clima solo cuando:
  //  - está logueado
  //  - está en vista "clima"
  //  - ya tenemos una ciudad válida
  useEffect(() => {
    if (!isLogged || view !== "clima" || !city) return;

    let alive = true;

    (async () => {
      try {
        const data = await fetchCurrentWeather(city);
        if (alive) setCurrent(data);
      } catch {
        if (alive) setCurrent(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isLogged, view, city?.latitude, city?.longitude]);

  // cuando el usuario elige una app en el menú
  const handleSelectApp = (app) => {
    if (app === "clima") {
      setView("clima");
      setCity(null); // forzar que se vuelva a calcular ubicación cuando entre
      setCurrent(null);
    } else if (app === "app2") {
      window.open("https://ejemplo-app2.com", "_blank");
    } else if (app === "app3") {
      window.open("https://ejemplo-app3.com", "_blank");
    } else if (app === "app4") {
      window.open("https://ejemplo-app4.com", "_blank");
    }
  };

  return (
    <ThemeProvider>
      {/* 1️⃣ Si NO está logueado → solo login */}
      {!isLogged && (
        <Login
          onLogin={(user) => {
            setCurrentUser(user);
            setIsLogged(true);
            setView("menu");
            setCity(null);
            setCurrent(null);
          }}
        />
      )}

      {/* 2️⃣ Logueado y en menú → 4 opciones */}
      {isLogged && view === "menu" && (
        <Home onSelectApp={handleSelectApp} user={currentUser} />
      )}

      {/* 3️⃣ Logueado y en vista "clima" → tu app de clima completa */}
      {isLogged && view === "clima" && (
        <>
          <Header
            city={city || { name: loadingCity ? "Obteniendo ubicación..." : "Ciudad" }}
            onCityChange={(c) => {
              setCity(c);
              setCityError("");
            }}
          />

          <main className="container row">
            {/* Mensaje si hay error de ubicación */}
            {cityError && (
              <div className="card" style={{ width: "100%" }}>
                <p style={{ margin: 0, color: "#f44336" }}>{cityError}</p>
              </div>
            )}

            {/* Si aún no tenemos ciudad, mostramos solo un mensaje */}
            {!city ? (
              <div className="card" style={{ width: "100%" }}>
                <p style={{ margin: 0 }}>
                  {loadingCity
                    ? "Obteniendo tu ubicación..."
                    : "Selecciona una ciudad para ver el clima."}
                </p>
              </div>
            ) : (
              <>
                <div className="card">
                  <CurrentCard current={current} />
                </div>

                <div className="card">
                  <h3 style={{ marginTop: 0 }}>Hoy</h3>
                  <WeatherList city={city} />
                </div>

                <div className="card">
                  <WeeklyForecast city={city} />
                </div>
              </>
            )}
          </main>
        </>
      )}
    </ThemeProvider>
  );
}
