const repo = require("../db/palabrasRepository");
const {
  validarNuevaPalabra,
  validarActualizacionPalabra,
} = require("../validation/palabrasValidator");

// Lista palabras según filtros (GET /api/palabras)
async function listarPalabras(filtros) {
  return repo.buscar(filtros);
}

// Obtiene una palabra por id (GET /api/palabras/:id)
async function obtenerPalabra(id) {
  const palabra = repo.buscarPorId(id);
  if (!palabra || !palabra.activa) {
    const err = new Error("Palabra no encontrada");
    err.status = 404;
    throw err;
  }
  return palabra;
}

// Crea una palabra nueva (POST /api/palabras)
async function crearPalabra(data) {
  const errores = validarNuevaPalabra(data);
  if (errores.length > 0) {
    const err = new Error("Datos inválidos");
    err.status = 400;
    err.detalles = errores;
    throw err;
  }

  const ahora = new Date().toISOString();
  const nueva = {
    texto: data.texto.trim(),
    categoria: data.categoria || "general",
    dificultad: data.dificultad || "facil",
    idioma: data.idioma || "es",
    esFavorita: data.esFavorita ?? false,
    vecesUsada: 0,
    activa: true,
    creadaEn: ahora,
    actualizadaEn: ahora,
  };

  return repo.insertar(nueva);
}

// Actualiza una palabra (PUT /api/palabras/:id)
async function actualizarPalabra(id, data) {
  const existente = await obtenerPalabra(id);

  const errores = validarActualizacionPalabra(data);
  if (errores.length > 0) {
    const err = new Error("Datos inválidos");
    err.status = 400;
    err.detalles = errores;
    throw err;
  }

  const actualizada = {
    ...existente,
    ...data,
    texto: (data.texto ?? existente.texto).trim(),
    actualizadaEn: new Date().toISOString(),
  };

  return repo.actualizar(id, actualizada);
}

// Soft delete (DELETE /api/palabras/:id)
async function eliminarPalabra(id) {
  const existente = await obtenerPalabra(id);
  if (!existente.activa) return existente;

  const actualizada = {
    ...existente,
    activa: false,
    actualizadaEn: new Date().toISOString(),
  };

  return repo.actualizar(id, actualizada);
}

// Marca/desmarca favorita (POST /api/palabras/:id/favorita)
async function marcarFavorita(id, esFavorita) {
  const existente = await obtenerPalabra(id);
  const actualizada = {
    ...existente,
    esFavorita: !!esFavorita,
    actualizadaEn: new Date().toISOString(),
  };
  return repo.actualizar(id, actualizada);
}

// Incrementa contador de uso (POST /api/palabras/:id/usar)
async function registrarUso(id) {
  const existente = await obtenerPalabra(id);
  const actualizada = {
    ...existente,
    vecesUsada: existente.vecesUsada + 1,
    actualizadaEn: new Date().toISOString(),
  };
  return repo.actualizar(id, actualizada);
}

// Estadísticas (GET /api/palabras/stats/todo)
async function obtenerStats() {
  const todas = repo.buscarTodas({ incluirInactivas: false });

  const totalPalabrasActivas = todas.length;
  const totalPorCategoria = {};
  const totalPorDificultad = {};

  for (const p of todas) {
    totalPorCategoria[p.categoria] =
      (totalPorCategoria[p.categoria] || 0) + 1;
    totalPorDificultad[p.dificultad] =
      (totalPorDificultad[p.dificultad] || 0) + 1;
  }

  const topMasUsadas = [...todas]
    .sort((a, b) => b.vecesUsada - a.vecesUsada)
    .slice(0, 5);

  return {
    totalPalabrasActivas,
    totalPorCategoria,
    totalPorDificultad,
    topMasUsadas,
  };
}

module.exports = {
  listarPalabras,
  obtenerPalabra,
  crearPalabra,
  actualizarPalabra,
  eliminarPalabra,
  marcarFavorita,
  registrarUso,
  obtenerStats,
};
