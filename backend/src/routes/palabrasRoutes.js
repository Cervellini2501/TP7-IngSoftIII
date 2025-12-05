const express = require("express");
const controller = require("../controllers/palabrasController");

const router = express.Router();

// Rutas específicas primero

// GET /api/palabras/stats
router.get("/stats/todo", controller.obtenerStats);

// GET /api/palabras
router.get("/", controller.listar);

// GET /api/palabras/:id
router.get("/:id", controller.obtenerPorId);

// POST /api/palabras
router.post("/", controller.crear);

// PUT /api/palabras/:id
router.put("/:id", controller.actualizar);

// DELETE /api/palabras/:id
router.delete("/:id", controller.eliminar);

// POST /api/palabras/:id/favorita
router.post("/:id/favorita", controller.marcarFavorita);

// POST /api/palabras/:id/usar
router.post("/:id/usar", controller.registrarUso);

module.exports = router;
