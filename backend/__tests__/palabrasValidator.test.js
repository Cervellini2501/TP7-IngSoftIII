const {
  validarNuevaPalabra,
  validarActualizacionPalabra,
} = require("../src/validation/palabrasValidator");

describe("validarNuevaPalabra", () => {
  test("devuelve error si falta texto", () => {
    const errores = validarNuevaPalabra({
      categoria: "general",
      dificultad: "facil",
      idioma: "es",
    });

    expect(errores).toContain("El texto debe ser una cadena");
  });

  test("devuelve error si el texto es muy corto", () => {
    const errores = validarNuevaPalabra({
      texto: "ho",
      categoria: "general",
      dificultad: "facil",
      idioma: "es",
    });

    expect(errores).toContain("El texto debe tener al menos 3 caracteres");
  });

  test("devuelve error si la categoría es inválida", () => {
    const errores = validarNuevaPalabra({
      texto: "hola mundo",
      categoria: "otra",
      dificultad: "facil",
      idioma: "es",
    });

    expect(errores.some((e) => e.includes("Categoría inválida"))).toBe(true);
  });

  test("no devuelve errores con datos válidos mínimos", () => {
    const errores = validarNuevaPalabra({
      texto: "hola mundo",
      categoria: "general",
      dificultad: "facil",
      idioma: "es",
    });

    expect(errores).toHaveLength(0);
  });
});

describe("validarActualizacionPalabra", () => {
  test("no obliga a enviar todos los campos", () => {
    const errores = validarActualizacionPalabra({
      texto: "nuevo texto",
    });

    expect(errores).toHaveLength(0);
  });

  test("valida formato de texto si viene", () => {
    const errores = validarActualizacionPalabra({
      texto: "a",
    });

    expect(errores).toContain("El texto debe tener al menos 3 caracteres");
  });

  test("valida dificultad inválida", () => {
    const errores = validarActualizacionPalabra({
      dificultad: "super dificil",
    });

    expect(errores.some((e) => e.includes("Dificultad inválida"))).toBe(true);
  });

  test("valida esFavorita cuando no es boolean", () => {
    const errores = validarActualizacionPalabra({
      esFavorita: "si",
    });

    expect(errores).toContain("esFavorita debe ser boolean");
  });
});
