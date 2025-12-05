// frontend/src/__tests__/App.test.jsx
import { describe, test, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import App from "../App";

// Limpia mocks antes de cada test
beforeEach(() => {
  vi.restoreAllMocks();
});

// -------------------------------------------------------------
// 1) Layout básico
// -------------------------------------------------------------
describe("App - layout básico", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  test("muestra el título principal y el botón Recargar", async () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /gestión de palabras/i })
    ).toBeInTheDocument();

    const boton = await screen.findByRole("button", { name: /recargar/i });
    expect(boton).toBeInTheDocument();
  });
});

// -------------------------------------------------------------
// 2) Integración básica con backend mockeado
// -------------------------------------------------------------
describe("App - integración básica con el backend (mockeado)", () => {
  test("al montar la App hace fetch a /api/palabras", async () => {
    const mockFetch = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch.mock.calls[0][0]).toContain("/api/palabras");
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

    await waitFor(() =>
      expect(screen.getByText(/hola mundo/i)).toBeInTheDocument()
    );
  });

  test("muestra un mensaje de error si fetch falla", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Error al obtener palabras" }),
    });

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    );
  });
});

// -------------------------------------------------------------
// 3) Crear y eliminar palabras
// -------------------------------------------------------------
describe("App - creación y eliminación de palabras", () => {
  test("permite crear una nueva palabra y mostrarla en pantalla", async () => {
    // 1er fetch: lista inicial vacía
    const mockFetch = vi.spyOn(global, "fetch");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    // Esperar carga inicial
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    // Buscar sección "Nueva palabra"
    const nuevaSection = screen
      .getByRole("heading", { name: /nueva palabra/i })
      .closest("section");

    const dentroDeNueva = within(nuevaSection);

    // Completar formulario
    fireEvent.change(dentroDeNueva.getByLabelText(/texto/i), {
      target: { value: "Prueba App" },
    });

    fireEvent.change(dentroDeNueva.getAllByLabelText(/categoría/i)[0], {
      target: { value: "general" },
    });

    // 2º fetch: respuesta del POST creando la palabra
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 99,
        texto: "Prueba App",
        categoria: "general",
        dificultad: "facil",
        idioma: "es",
        esFavorita: false,
      }),
    });

    // Enviar formulario
    fireEvent.click(dentroDeNueva.getByRole("button", { name: /crear/i }));

    // Validar que se muestra
    await waitFor(() =>
      expect(screen.getByText(/prueba app/i)).toBeInTheDocument()
    );
  });

  test("permite eliminar una palabra", async () => {
    // Mock de window.confirm para que devuelva TRUE
    global.confirm = vi.fn(() => true);

    const mockFetch = vi.spyOn(global, "fetch");

    // 1er fetch: carga inicial con una palabra
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 5,
          texto: "Borrar esto",
          categoria: "general",
          dificultad: "facil",
          idioma: "es",
          esFavorita: false,
        },
      ],
    });

    // 2º fetch: DELETE exitoso
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => ({}),
    });

    render(<App />);

    // Asegurarnos de que la palabra está al principio
    await waitFor(() =>
      expect(screen.getByText(/borrar esto/i)).toBeInTheDocument()
    );

    const eliminarBtn = screen.getByRole("button", { name: /eliminar/i });
    fireEvent.click(eliminarBtn);

    // Ahora esperamos que ya no esté en el DOM
    await waitFor(() =>
      expect(screen.queryByText(/borrar esto/i)).not.toBeInTheDocument()
    );
  });
});
