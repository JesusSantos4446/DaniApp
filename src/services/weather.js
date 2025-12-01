const WMO = {
  0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
  45: "Neblina", 48: "Neblina con escarcha",
  51: "Llovizna ligera", 53: "Llovizna", 55: "Llovizna intensa",
  61: "Lluvia ligera", 63: "Lluvia", 65: "Lluvia intensa",
  71: "Nieve ligera", 73: "Nieve", 75: "Nieve intensa",
  80: "Chubascos ligeros", 81: "Chubascos", 82: "Chubascos intensos",
  95: "Tormenta", 96: "Tormenta con granizo", 99: "Tormenta fuerte con granizo"
};

export function iconFor(code, isNight) {
  if ([0].includes(code)) return isNight ? "🌙" : "☀️";
  if ([1,2].includes(code)) return isNight ? "🌙" : "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55].includes(code)) return "🌦️";
  if ([61,63,65,80,81,82].includes(code)) return "🌧️";
  if ([71,73,75].includes(code)) return "❄️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "❔";
}

export async function fetchHourlyWeather({ latitude, longitude, timezone = "auto" }) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&hourly=temperature_2m,weather_code,precipitation_probability` +
    `&forecast_days=1&timezone=${timezone}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather");
  const data = await res.json();

  const t = data?.hourly?.time || [];
  const temp = data?.hourly?.temperature_2m || [];
  const code = data?.hourly?.weather_code || [];
  const pop = data?.hourly?.precipitation_probability || [];

  return t.map((iso, i) => ({
    iso,
    temp: temp[i],
    code: code[i],
    pop: pop[i] ?? 0
  }));
}

// Actual
export async function fetchCurrentWeather({ latitude, longitude, timezone = "auto" }) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,is_day` +
    `&timezone=${timezone}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  const data = await res.json();
  const c = data.current || {};
  return {
    temperature: c.temperature_2m,
    feels_like: c.apparent_temperature,
    weather_code: c.weather_code,
    weather_text: WMO[c.weather_code] || "—",
    humidity: c.relative_humidity_2m,
    wind_kmh: c.wind_speed_10m,
    is_day: !!c.is_day
  };
}

// Búsqueda
export async function searchCities(query, limit = 10) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=${limit}&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to search cities");
  const data = await res.json();
  return (data.results || []).map(r => ({
    id: `${r.name}-${r.latitude}-${r.longitude}`,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    label: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}, ${r.country}`
  }));
}

export { WMO };

// Open-Meteo: daily forecast
export async function fetchDailyWeather(city) {
  const { latitude, longitude } = city;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("timezone", "auto");
  // weathercode + temp max/min + precip prob máx
  url.searchParams.set("daily", [
    "weathercode",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_probability_max"
  ].join(","));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("No se pudo consultar el pronóstico diario");
  const j = await res.json();

  // normalizamos a [{date,max,min,precip,code}]
  const out = (j.daily.time || []).map((t, i) => ({
    date: t,
    max: j.daily.temperature_2m_max?.[i],
    min: j.daily.temperature_2m_min?.[i],
    precip: j.daily.precipitation_probability_max?.[i],
    code: j.daily.weathercode?.[i]
  }));

  // nos quedamos con 7 días
  return out.slice(0, 7);
}
