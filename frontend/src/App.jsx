import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:3000/api";

function App() {
  const [palabras, setPalabras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filtros
  const [filtros, setFiltros] = useState({
    texto: "",
    categoria: "todas",
    dificultad: "todas",
    idioma: "todas",
    soloFavoritas: false,
  });

  // Formulario de nueva palabra
  const [nueva, setNueva] = useState({
    texto: "",
    categoria: "general",
    dificultad: "facil",
    idioma: "es",
  });

  async function cargarPalabras() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filtros.texto.trim() !== "") params.append("texto", filtros.texto);
      if (filtros.categoria !== "todas")
        params.append("categoria", filtros.categoria);
      if (filtros.dificultad !== "todas")
        params.append("dificultad", filtros.dificultad);
      if (filtros.idioma !== "todas") params.append("idioma", filtros.idioma);
      if (filtros.soloFavoritas) params.append("soloFavoritas", "true");

      const url = `${API_BASE_URL}/palabras${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error("Error al obtener palabras");
      }
      const data = await resp.json();
      setPalabras(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPalabras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChangeFiltros(e) {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmitFiltros(e) {
    e.preventDefault();
    await cargarPalabras();
  }

  function handleChangeNueva(e) {
    const { name, value } = e.target;
    setNueva((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleCrear(e) {
    e.preventDefault();
    if (!nueva.texto.trim()) {
      alert("El texto es obligatorio");
      return;
    }

    try {
      setError("");

      const resp = await fetch(`${API_BASE_URL}/palabras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nueva),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error || "Error al crear palabra");
      }

      const creada = await resp.json();

      setPalabras((prev) => [...prev, creada]);
      setNueva({
        texto: "",
        categoria: "general",
        dificultad: "facil",
        idioma: "es",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error inesperado");
    }
  }

  async function handleToggleFavorita(palabra) {
    try {
      setError("");

      const resp = await fetch(
        `${API_BASE_URL}/palabras/${palabra.id}/favorita`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ esFavorita: !palabra.esFavorita }),
        }
      );

      if (!resp.ok) {
        throw new Error("Error al actualizar favorito");
      }

      const actualizada = await resp.json();

      setPalabras((prev) =>
        prev.map((p) => (p.id === actualizada.id ? actualizada : p))
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Error inesperado");
    }
  }

  async function handleEliminar(palabra) {
    if (!confirm(`¿Eliminar "${palabra.texto}"?`)) return;

    try {
      setError("");
      const resp = await fetch(`${API_BASE_URL}/palabras/${palabra.id}`, {
        method: "DELETE",
      });

      if (!resp.ok && resp.status !== 204) {
        throw new Error("Error al eliminar palabra");
      }

      setPalabras((prev) => prev.filter((p) => p.id !== palabra.id));
    } catch (err) {
      console.error(err);
      setError(err.message || "Error inesperado");
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Gestión de Palabras</h1>
          <p className="subtitle">
            Backend: <code>http://localhost:3000/api/palabras</code>
          </p>
        </div>
        <button className="primary" onClick={cargarPalabras} disabled={loading}>
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </header>

      {/* Panel de filtros */}
      <section className="card filters-card">
        <h2>Filtros</h2>
        <form className="filters-form" onSubmit={handleSubmitFiltros}>
          <div className="field">
            <label htmlFor="texto">Buscar por texto</label>
            <input
              id="texto"
              name="texto"
              type="text"
              placeholder="ej. hola"
              value={filtros.texto}
              onChange={handleChangeFiltros}
            />
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              value={filtros.categoria}
              onChange={handleChangeFiltros}
            >
              <option value="todas">Todas</option>
              <option value="general">General</option>
              <option value="verbos">Verbos</option>
              <option value="sustantivos">Sustantivos</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="dificultad">Dificultad</label>
            <select
              id="dificultad"
              name="dificultad"
              value={filtros.dificultad}
              onChange={handleChangeFiltros}
            >
              <option value="todas">Todas</option>
              <option value="facil">Fácil</option>
              <option value="media">Media</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="idioma">Idioma</label>
            <select
              id="idioma"
              name="idioma"
              value={filtros.idioma}
              onChange={handleChangeFiltros}
            >
              <option value="todas">Todos</option>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          <label className="checkbox-field">
            <input
              type="checkbox"
              name="soloFavoritas"
              checked={filtros.soloFavoritas}
              onChange={handleChangeFiltros}
            />
            Solo favoritas
          </label>

          <button type="submit" className="secondary">
            Aplicar filtros
          </button>
        </form>
      </section>

      {/* Panel para crear nueva palabra */}
      <section className="card">
        <h2>Nueva palabra</h2>
        <form className="new-form" onSubmit={handleCrear}>
          <div className="field full">
            <label htmlFor="textoNuevo">Texto</label>
            <input
              id="textoNuevo"
              name="texto"
              type="text"
              required
              value={nueva.texto}
              onChange={handleChangeNueva}
              placeholder="Escribe la palabra..."
            />
          </div>

          <div className="field">
            <label htmlFor="categoriaNueva">Categoría</label>
            <select
              id="categoriaNueva"
              name="categoria"
              value={nueva.categoria}
              onChange={handleChangeNueva}
            >
              <option value="general">General</option>
              <option value="verbos">Verbos</option>
              <option value="sustantivos">Sustantivos</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="dificultadNueva">Dificultad</label>
            <select
              id="dificultadNueva"
              name="dificultad"
              value={nueva.dificultad}
              onChange={handleChangeNueva}
            >
              <option value="facil">Fácil</option>
              <option value="media">Media</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="idiomaNuevo">Idioma</label>
            <select
              id="idiomaNuevo"
              name="idioma"
              value={nueva.idioma}
              onChange={handleChangeNueva}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          <div className="actions-right">
            <button type="submit" className="primary">
              Crear
            </button>
          </div>
        </form>
      </section>

      {/* Lista de palabras */}
      <section className="card">
        <div className="list-header">
          <h2>Palabras ({palabras.length})</h2>
        </div>

        {error && <div className="error">{error}</div>}

        {loading && <p>Cargando palabras...</p>}

        {!loading && !palabras.length && !error && (
          <p className="empty">No hay palabras para mostrar.</p>
        )}

        <div className="palabras-grid">
          {palabras.map((p) => (
            <article key={p.id} className="palabra-card">
              <header className="palabra-header">
                <h3>{p.texto}</h3>
                <button
                  type="button"
                  className={`icon-button ${p.esFavorita ? "favorite" : ""}`}
                  onClick={() => handleToggleFavorita(p)}
                  title={
                    p.esFavorita
                      ? "Quitar de favoritas"
                      : "Marcar como favorita"
                  }
                >
                  {p.esFavorita ? "★" : "☆"}
                </button>
              </header>

              <div className="tags">
                <span className="tag">{p.categoria || "sin categoría"}</span>
                <span className="tag tag-soft">{p.dificultad || "-"}</span>
                <span className="tag tag-soft">{p.idioma || "-"}</span>
              </div>

              <footer className="palabra-footer">
                <span className="veces">
                  Veces usada: <strong>{p.vecesUsada ?? 0}</strong>
                </span>
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleEliminar(p)}
                >
                  Eliminar
                </button>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
