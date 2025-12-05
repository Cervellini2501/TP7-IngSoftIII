jest.mock("../src/services/palabrasService");

const service = require("../src/services/palabrasService");
const controller = require("../src/controllers/palabrasController");

// Para que no ensucie la salida con errores simulados
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("palabrasController - listar", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("devuelve 200 y la lista de palabras", async () => {
    const req = { query: {} };
    const res = mockRes();

    service.listarPalabras.mockResolvedValue([
      { id: 1, texto: "hola" },
      { id: 2, texto: "chau" },
    ]);

    await controller.listar(req, res);

    expect(service.listarPalabras).toHaveBeenCalledWith({
      categoria: undefined,
      dificultad: undefined,
      idioma: undefined,
      soloFavoritas: false,
      texto: undefined,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, texto: "hola" },
      { id: 2, texto: "chau" },
    ]);
  });

  test("devuelve 500 si el service lanza error", async () => {
    const req = { query: {} };
    const res = mockRes();

    service.listarPalabras.mockRejectedValue(new Error("Error raro"));

    await controller.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al listar palabras",
    });
  });
});

describe("palabrasController - crear", () => {
  beforeEach(() => jest.resetAllMocks());

  test("devuelve 201 cuando se crea la palabra", async () => {
    const req = {
      body: {
        texto: "hola mundo",
        categoria: "general",
        dificultad: "facil",
        idioma: "es",
      },
    };
    const res = mockRes();

    const creada = { id: 1, ...req.body };
    service.crearPalabra.mockResolvedValue(creada);

    await controller.crear(req, res);

    expect(service.crearPalabra).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(creada);
  });

  test("devuelve status de error y detalles si el service tira error de validación", async () => {
    const req = { body: {} };
    const res = mockRes();

    const err = new Error("Datos inválidos");
    err.status = 400;
    err.detalles = ["El texto es obligatorio"];
    service.crearPalabra.mockRejectedValue(err);

    await controller.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Datos inválidos",
      detalles: ["El texto es obligatorio"],
    });
  });
});

describe("palabrasController - obtenerPorId", () => {
  beforeEach(() => jest.resetAllMocks());

  test("devuelve 200 si la palabra existe", async () => {
    const req = { params: { id: "1" } };
    const res = mockRes();

    service.obtenerPalabra.mockResolvedValue({ id: 1, texto: "hola" });

    await controller.obtenerPorId(req, res);

    expect(service.obtenerPalabra).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ id: 1, texto: "hola" });
  });

  test("devuelve status del error si la palabra no existe", async () => {
    const req = { params: { id: "99" } };
    const res = mockRes();

    const err = new Error("Palabra no encontrada");
    err.status = 404;
    service.obtenerPalabra.mockRejectedValue(err);

    await controller.obtenerPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Palabra no encontrada",
    });
  });
});

describe("palabrasController - actualizar", () => {
  beforeEach(() => jest.resetAllMocks());

  test("devuelve la palabra actualizada", async () => {
    const req = { params: { id: "5" }, body: { texto: "nuevo" } };
    const res = mockRes();

    const actualizada = { id: 5, texto: "nuevo" };
    service.actualizarPalabra.mockResolvedValue(actualizada);

    await controller.actualizar(req, res);

    expect(service.actualizarPalabra).toHaveBeenCalledWith(5, { texto: "nuevo" });
    expect(res.json).toHaveBeenCalledWith(actualizada);
  });

  test("devuelve status del error y detalles si falla", async () => {
    const req = { params: { id: "5" }, body: { texto: "" } };
    const res = mockRes();

    const err = new Error("Datos inválidos");
    err.status = 400;
    err.detalles = ["Texto requerido"];
    service.actualizarPalabra.mockRejectedValue(err);

    await controller.actualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Datos inválidos",
      detalles: ["Texto requerido"],
    });
  });
});

describe("palabrasController - eliminar", () => {
  beforeEach(() => jest.resetAllMocks());

  test("devuelve 204 cuando elimina", async () => {
    const req = { params: { id: "3" } };
    const res = mockRes();

    service.eliminarPalabra.mockResolvedValue();

    await controller.eliminar(req, res);

    expect(service.eliminarPalabra).toHaveBeenCalledWith(3);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("devuelve 500 si el service lanza error sin status", async () => {
    const req = { params: { id: "3" } };
    const res = mockRes();

    const err = new Error("Fallo raro");
    service.eliminarPalabra.mockRejectedValue(err);

    await controller.eliminar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Fallo raro",
    });
  });
});

describe("palabrasController - marcarFavorita", () => {
  beforeEach(() => jest.resetAllMocks());

  test("marca/desmarca favorita correctamente", async () => {
    const req = { params: { id: "7" }, body: { esFavorita: true } };
    const res = mockRes();

    const actualizada = { id: 7, texto: "hola", esFavorita: true };
    service.marcarFavorita.mockResolvedValue(actualizada);

    await controller.marcarFavorita(req, res);

    expect(service.marcarFavorita).toHaveBeenCalledWith(7, true);
    expect(res.json).toHaveBeenCalledWith(actualizada);
  });

  test("devuelve status del error si falla", async () => {
    const req = { params: { id: "7" }, body: { esFavorita: true } };
    const res = mockRes();

    const err = new Error("No encontrada");
    err.status = 404;
    service.marcarFavorita.mockRejectedValue(err);

    await controller.marcarFavorita(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "No encontrada",
    });
  });
});

describe("palabrasController - registrarUso", () => {
  beforeEach(() => jest.resetAllMocks());

  test("devuelve palabra actualizada con uso registrado", async () => {
    const req = { params: { id: "10" } };
    const res = mockRes();

    const actualizada = { id: 10, texto: "hola", usos: 5 };
    service.registrarUso.mockResolvedValue(actualizada);

    await controller.registrarUso(req, res);

    expect(service.registrarUso).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith(actualizada);
  });

  test("devuelve status del error si falla", async () => {
    const req = { params: { id: "10" } };
    const res = mockRes();

    const err = new Error("No encontrada");
    err.status = 404;
    service.registrarUso.mockRejectedValue(err);

    await controller.registrarUso(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "No encontrada",
    });
  });
});

describe("palabrasController - obtenerStats", () => {
  beforeEach(() => jest.resetAllMocks());

  test("devuelve las estadísticas", async () => {
    const req = {};
    const res = mockRes();

    const stats = { total: 10, favoritas: 3 };
    service.obtenerStats.mockResolvedValue(stats);

    await controller.obtenerStats(req, res);

    expect(service.obtenerStats).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(stats);
  });

  test("devuelve 500 si el service lanza error", async () => {
    const req = {};
    const res = mockRes();

    service.obtenerStats.mockRejectedValue(new Error("Error stats"));

    await controller.obtenerStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener estadísticas",
    });
  });
});
