// Mockeamos el repo para NO tocar la DB real
jest.mock("../src/db/palabrasRepository");

const repo = require("../src/db/palabrasRepository");
const service = require("../src/services/palabrasService");

describe("palabrasService - crearPalabra", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("crea una palabra válida", async () => {
    repo.insertar.mockReturnValue({ id: 1, texto: "hola" });

    const data = { texto: "hola" };
    const result = await service.crearPalabra(data);

    expect(repo.insertar).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(1);
  });

  test("lanza error si faltan datos obligatorios", async () => {
    await expect(service.crearPalabra({})).rejects.toThrow("Datos inválidos");
  });
});

describe("palabrasService - obtenerPalabra", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna palabra si existe y está activa", async () => {
    repo.buscarPorId.mockReturnValue({ id: 1, activa: true });

    const palabra = await service.obtenerPalabra(1);

    expect(repo.buscarPorId).toHaveBeenCalledWith(1);
    expect(palabra.id).toBe(1);
  });

  test("lanza error si la palabra no existe", async () => {
    repo.buscarPorId.mockReturnValue(null);

    await expect(service.obtenerPalabra(99)).rejects.toThrow(
      "Palabra no encontrada"
    );
  });

  test("lanza error si la palabra está inactiva", async () => {
    repo.buscarPorId.mockReturnValue({ id: 1, activa: false });

    await expect(service.obtenerPalabra(1)).rejects.toThrow(
      "Palabra no encontrada"
    );
  });
});

describe("palabrasService - actualizarPalabra", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("actualiza una palabra válida", async () => {
    repo.buscarPorId.mockReturnValue({ id: 1, activa: true, texto: "hola" });
    repo.actualizar.mockReturnValue({ id: 1, texto: "hola editada" });

    const result = await service.actualizarPalabra(1, {
      texto: "hola editada",
    });

    expect(repo.actualizar).toHaveBeenCalledTimes(1);
    expect(result.texto).toBe("hola editada");
  });

  test("lanza error si la palabra no existe al actualizar", async () => {
    repo.buscarPorId.mockReturnValue(null);

    await expect(
      service.actualizarPalabra(1, { texto: "algo" })
    ).rejects.toThrow("Palabra no encontrada");
  });
});

describe("palabrasService - eliminarPalabra", () => {
  beforeEach(() => jest.resetAllMocks());

  test("marca una palabra como inactiva si estaba activa", async () => {
    repo.buscarPorId.mockReturnValue({ id: 1, activa: true });
    repo.actualizar.mockReturnValue({ id: 1, activa: false });

    const result = await service.eliminarPalabra(1);

    expect(repo.actualizar).toHaveBeenCalled();
    expect(result.activa).toBe(false);
  });
});

describe("palabrasService - registrarUso", () => {
  beforeEach(() => jest.resetAllMocks());

  test("incrementa contador de uso", async () => {
    repo.buscarPorId.mockReturnValue({
      id: 1,
      activa: true,
      vecesUsada: 3,
    });

    repo.actualizar.mockReturnValue({ id: 1, vecesUsada: 4 });

    const result = await service.registrarUso(1);

    expect(repo.actualizar).toHaveBeenCalled();
    expect(result.vecesUsada).toBe(4);
  });
});

describe("palabrasService - marcarFavorita", () => {
  beforeEach(() => jest.resetAllMocks());

  test("marca como favorita", async () => {
    repo.buscarPorId.mockReturnValue({
      id: 1,
      activa: true,
      esFavorita: false,
    });

    repo.actualizar.mockReturnValue({
      id: 1,
      activa: true,
      esFavorita: true,
    });

    const result = await service.marcarFavorita(1, true);

    expect(repo.actualizar).toHaveBeenCalled();
    expect(result.esFavorita).toBe(true);
  });
});

describe("palabrasService - obtenerStats", () => {
  beforeEach(() => jest.resetAllMocks());

  test("calcula estadísticas básicas", async () => {
    repo.buscarTodas.mockReturnValue([
      { categoria: "general", dificultad: "facil", vecesUsada: 3 },
      { categoria: "general", dificultad: "media", vecesUsada: 5 },
      { categoria: "tecnica", dificultad: "dificil", vecesUsada: 1 },
    ]);

    const stats = await service.obtenerStats();

    expect(stats.totalPalabrasActivas).toBe(3);
    expect(stats.totalPorCategoria.general).toBe(2);
    expect(stats.totalPorCategoria.tecnica).toBe(1);
    expect(stats.topMasUsadas[0].vecesUsada).toBe(5);
  });
});
