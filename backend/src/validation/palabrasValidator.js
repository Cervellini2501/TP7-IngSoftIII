const CATEGORIAS_PERMITIDAS = ["general", "tecnica", "slang"];
const DIFICULTADES_PERMITIDAS = ["facil", "media", "dificil"];
const IDIOMAS_PERMITIDOS = ["es", "en"];

function validarTexto(texto) {
  if (typeof texto !== "string") {
    return "El texto debe ser una cadena";
  }
  const trim = texto.trim();
  if (trim.length === 0) {
    return "El texto es obligatorio";
  }
  if (trim.length < 3) {
    return "El texto debe tener al menos 3 caracteres";
  }
  if (trim.length > 100) {
    return "El texto no puede superar los 100 caracteres";
  }
  return null;
}

function validarCategoria(categoria) {
  if (!categoria) return null; // opcional
  if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
    return `Categoría inválida. Debe ser una de: ${CATEGORIAS_PERMITIDAS.join(
      ", "
    )}`;
  }
  return null;
}

function validarDificultad(dificultad) {
  if (!dificultad) return null;
  if (!DIFICULTADES_PERMITIDAS.includes(dificultad)) {
    return `Dificultad inválida. Debe ser una de: ${DIFICULTADES_PERMITIDAS.join(
      ", "
    )}`;
  }
  return null;
}

function validarIdioma(idioma) {
  if (!idioma) return null;
  if (!IDIOMAS_PERMITIDOS.includes(idioma)) {
    return `Idioma inválido. Debe ser una de: ${IDIOMAS_PERMITIDOS.join(", ")}`;
  }
  return null;
}

function validarNuevaPalabra(data) {
  const errores = [];

  const errTexto = validarTexto(data.texto);
  if (errTexto) errores.push(errTexto);

  const errCat = validarCategoria(data.categoria);
  if (errCat) errores.push(errCat);

  const errDif = validarDificultad(data.dificultad);
  if (errDif) errores.push(errDif);

  const errIdiom = validarIdioma(data.idioma);
  if (errIdiom) errores.push(errIdiom);

  if (data.esFavorita !== undefined && typeof data.esFavorita !== "boolean") {
    errores.push("esFavorita debe ser boolean");
  }

  return errores;
}

function validarActualizacionPalabra(data) {
  const errores = [];

  if (data.texto !== undefined) {
    const errTexto = validarTexto(data.texto);
    if (errTexto) errores.push(errTexto);
  }
  if (data.categoria !== undefined) {
    const errCat = validarCategoria(data.categoria);
    if (errCat) errores.push(errCat);
  }
  if (data.dificultad !== undefined) {
    const errDif = validarDificultad(data.dificultad);
    if (errDif) errores.push(errDif);
  }
  if (data.idioma !== undefined) {
    const errIdiom = validarIdioma(data.idioma);
    if (errIdiom) errores.push(errIdiom);
  }
  if (data.esFavorita !== undefined && typeof data.esFavorita !== "boolean") {
    errores.push("esFavorita debe ser boolean");
  }

  return errores;
}

module.exports = {
  validarNuevaPalabra,
  validarActualizacionPalabra,
  CATEGORIAS_PERMITIDAS,
  DIFICULTADES_PERMITIDAS,
  IDIOMAS_PERMITIDOS,
};
