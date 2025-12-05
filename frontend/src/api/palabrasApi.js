// frontend/src/api/palabrasApi.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function obtenerPalabras() {
  const res = await fetch(`${API_URL}/api/palabras`);

  if (!res.ok) {
    throw new Error(`Error al obtener palabras: ${res.status}`);
  }

  return res.json();
}
