const Database = require("better-sqlite3");

// Creamos la conexión ACÁ directamente
const db = new Database("palabras.db");

// Creamos la tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS palabras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    categoria TEXT DEFAULT 'general',
    dificultad TEXT DEFAULT 'facil',
    idioma TEXT DEFAULT 'es',
    esFavorita INTEGER DEFAULT 0,
    vecesUsada INTEGER DEFAULT 0,
    activa INTEGER DEFAULT 1,
    creadaEn TEXT,
    actualizadaEn TEXT
  );
`);

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    texto: row.texto,
    categoria: row.categoria,
    dificultad: row.dificultad,
    idioma: row.idioma,
    esFavorita: !!row.esFavorita,
    vecesUsada: row.vecesUsada,
    activa: !!row.activa,
    creadaEn: row.creadaEn,
    actualizadaEn: row.actualizadaEn,
  };
}

function buscar({ categoria, dificultad, idioma, soloFavoritas, texto } = {}) {
  let query = "SELECT * FROM palabras WHERE activa = 1";
  const params = [];

  if (categoria) {
    query += " AND categoria = ?";
    params.push(categoria);
  }
  if (dificultad) {
    query += " AND dificultad = ?";
    params.push(dificultad);
  }
  if (idioma) {
    query += " AND idioma = ?";
    params.push(idioma);
  }
  if (soloFavoritas) {
    query += " AND esFavorita = 1";
  }
  if (texto) {
    query += " AND texto LIKE ?";
    params.push(`%${texto}%`);
  }

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(mapRow);
}

function buscarPorId(id) {
  const stmt = db.prepare("SELECT * FROM palabras WHERE id = ?");
  const row = stmt.get(id);
  return mapRow(row);
}

function insertar(palabra) {
  const stmt = db.prepare(`
    INSERT INTO palabras (
      texto, categoria, dificultad, idioma,
      esFavorita, vecesUsada, activa, creadaEn, actualizadaEn
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    palabra.texto,
    palabra.categoria,
    palabra.dificultad,
    palabra.idioma,
    palabra.esFavorita ? 1 : 0,
    palabra.vecesUsada ?? 0,
    palabra.activa ? 1 : 0,
    palabra.creadaEn,
    palabra.actualizadaEn
  );

  return buscarPorId(result.lastInsertRowid);
}

function actualizar(id, palabra) {
  const stmt = db.prepare(`
    UPDATE palabras
    SET texto = ?, categoria = ?, dificultad = ?, idioma = ?,
        esFavorita = ?, vecesUsada = ?, activa = ?, actualizadaEn = ?
    WHERE id = ?
  `);

  stmt.run(
    palabra.texto,
    palabra.categoria,
    palabra.dificultad,
    palabra.idioma,
    palabra.esFavorita ? 1 : 0,
    palabra.vecesUsada ?? 0,
    palabra.activa ? 1 : 0,
    palabra.actualizadaEn,
    id
  );

  return buscarPorId(id);
}

function buscarTodas({ incluirInactivas = false } = {}) {
  let query = "SELECT * FROM palabras";
  if (!incluirInactivas) {
    query += " WHERE activa = 1";
  }
  const rows = db.prepare(query).all();
  return rows.map(mapRow);
}

module.exports = {
  buscar,
  buscarPorId,
  insertar,
  actualizar,
  buscarTodas,
};
