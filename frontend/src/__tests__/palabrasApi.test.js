import { describe, it, expect, vi, beforeEach } from "vitest";
import { obtenerPalabras } from "../api/palabrasApi";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("palabrasApi.obtenerPalabras", () => {
  it("devuelve el JSON cuando la respuesta es OK", async () => {
    const datos = [{ id: 1, texto: "hola" }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => datos,
    });

    const res = await obtenerPalabras();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res).toEqual(datos);
  });

  it("lanza error cuando la respuesta NO es OK", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => [],
    });

    await expect(obtenerPalabras()).rejects.toThrow(
      "Error al obtener palabras: 500"
    );
  });
});
