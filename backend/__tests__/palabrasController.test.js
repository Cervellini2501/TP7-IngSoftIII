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

    // Tu controller arma filtros con texto/categoria/dificultad/idioma/soloFavoritas
    expect(service.listarPalabras).toHaveBeenCalledWith({
      texto: undefined,
      categoria: undefined,
      dificultad: undefined,
      idioma: undefined,
      soloFavoritas: false,
    });

    expect(res.status).not.toHaveBeenCalled();
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

  test("devuelve 400 si el service tira error de validación", async () => {
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
    // En tu controller NO seteás status en el caso OK, solo res.json
    expect(res.json).toHaveBeenCalledWith({ id: 1, texto: "hola" });
  });

  test("devuelve 404 si la palabra no existe", async () => {
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
