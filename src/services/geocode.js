// Convierte coordenadas (lat, lon) en una ciudad real usando Open-Meteo
export async function reverseGeocode(lat, lon) {
  const url = `https://api.open-meteo.com/v1/geocoding/reverse?latitude=${lat}&longitude=${lon}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.results && data.results.length > 0) {
      return {
        name: data.results[0].name,
        latitude: lat,
        longitude: lon
      };
    } else {
      // Si no encuentra nombre, regresamos coords sin nombre
      return {
        name: "Ciudad desconocida",
        latitude: lat,
        longitude: lon
      };
    }
  } catch {
    return {
      name: "Error al obtener nombre",
      latitude: lat,
      longitude: lon
    };
  }
}
