describe("Flujo de actualización de una palabra", () => {
  it("marca una palabra como favorita", () => {
    cy.visit("/");

    // Primero creo una palabra para asegurar que exista
    cy.get("#textoNuevo").type("Cypress actualizar");
    cy.get("#categoriaNueva").select("general");
    cy.get("#dificultadNueva").select("facil");
    cy.get("#idiomaNuevo").select("es");
    cy.contains("button", "Crear").click();

    // Buscar la card de esa palabra
    cy.contains("h3", "Cypress actualizar")
      .parents("article")
      .as("card");

    // Marcar como favorita (el botón con la estrellita)
    cy.get("@card")
      .find("button[title*='favorita']")
      .click();

    // Verificamos que la estrella cambió (☆ -> ★)
    cy.get("@card").contains("★").should("exist");
  });
});
