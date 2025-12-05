import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

// Limpieza de mocks antes de cada test
beforeEach(() => {
  vi.restoreAllMocks();
});

// -----------------------------------------------------------------------------
// Layout básico
// -----------------------------------------------------------------------------
describe("App - layout básico", () => {
  beforeEach(() => {
    // mock de fetch para que el useEffect no rompa
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  test("muestra el título principal y el botón Recargar", async () => {
    render(<App />);

    // Título principal
    expect(
      screen.getByRole("heading", { name: /gestión de palabras/i })
    ).toBeInTheDocument();

    // Botón Recargar (aparece una vez que termina la carga inicial)
    const boton = await screen.findByRole("button", { name: /recargar/i });
    expect(boton).toBeInTheDocument();
  });
});

// -----------------------------------------------------------------------------
// Integración básica con backend (mockeado)
// -----------------------------------------------------------------------------
describe("App - integración básica con el backend", () => {
  test("al montar la App hace un fetch a /api/palabras", async () => {
    const mockFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    // esperamos a que se haga al menos una llamada
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // verificamos la URL
    const firstCallUrl = mockFetch.mock.calls[0][0];
    expect(firstCallUrl).toContain("/api/palabras");
  });

  test("muestra una palabra cuando el backend devuelve datos", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          texto: "Hola mundo",
          categoria: "general",
          dificultad: "facil",
          idioma: "es",
          esFavorita: false,
        },
      ],
    });

    render(<App />);

    // esperamos a que se renderice el texto
    await waitFor(() => {
      expect(screen.getByText(/hola mundo/i)).toBeInTheDocument();
    });
  });

  test("al hacer clic en Recargar vuelve a llamar al backend", async () => {
    const mockFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          texto: "hola mundo",
          categoria: "general",
          dificultad: "facil",
          idioma: "es",
        },
      ],
    });

    render(<App />);

    // esperamos la primera llamada (montaje)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const llamadasAntes = mockFetch.mock.calls.length;

    const boton = screen.getByRole("button", { name: /recargar/i });
    fireEvent.click(boton);

    // esperamos a que aumente la cantidad de llamadas
    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBeGreaterThan(llamadasAntes);
    });
  });
});
