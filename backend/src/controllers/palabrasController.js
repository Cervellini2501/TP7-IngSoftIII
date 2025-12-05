const service = require("../services/palabrasService");

async function listar(req, res) {
  try {
    const filtros = {
      categoria: req.query.categoria,
      dificultad: req.query.dificultad,
      idioma: req.query.idioma,
      soloFavoritas: req.query.soloFavoritas === "true",
      texto: req.query.texto,
    };

    const resultado = await service.listarPalabras(filtros);
    res.status(200).json(resultado);
  } catch (err) {
    console.error("Error en listar:", err);
    res.status(500).json({ error: "Error al listar palabras" });
  }
}

async function obtenerPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const palabra = await service.obtenerPalabra(id);
    res.json(palabra);
  } catch (err) {
    console.error("Error en obtenerPorId:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function crear(req, res) {
  try {
    const nueva = await service.crearPalabra(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error("Error en crear:", err);
    res.status(err.status || 500).json({
      error: err.message,
      detalles: err.detalles || undefined,
    });
  }
}

async function actualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const actualizada = await service.actualizarPalabra(id, req.body);
    res.json(actualizada);
  } catch (err) {
    console.error("Error en actualizar:", err);
    res.status(err.status || 500).json({
      error: err.message,
      detalles: err.detalles || undefined,
    });
  }
}

async function eliminar(req, res) {
  try {
    const id = Number(req.params.id);
    await service.eliminarPalabra(id);
    res.status(204).send();
  } catch (err) {
    console.error("Error en eliminar:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function marcarFavorita(req, res) {
  try {
    const id = Number(req.params.id);
    const { esFavorita } = req.body;
    const actualizada = await service.marcarFavorita(id, esFavorita);
    res.json(actualizada);
  } catch (err) {
    console.error("Error en marcarFavorita:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function registrarUso(req, res) {
  try {
    const id = Number(req.params.id);
    const actualizada = await service.registrarUso(id);
    res.json(actualizada);
  } catch (err) {
    console.error("Error en registrarUso:", err);
    res.status(err.status || 500).json({ error: err.message });
  }
}

async function obtenerStats(req, res) {
  try {
    const stats = await service.obtenerStats();
    res.json(stats);
  } catch (err) {
    console.error("Error en obtenerStats:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  marcarFavorita,
  registrarUso,
  obtenerStats,
};
