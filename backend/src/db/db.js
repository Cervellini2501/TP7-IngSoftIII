const Database = require("better-sqlite3");

// Crea/abre el archivo de base de datos en la carpeta backend
const db = new Database("palabras.db");

// Crea la tabla si no existe
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

module.exports = db;
