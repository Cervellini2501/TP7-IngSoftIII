describe("Flujo completo de creación de una palabra", () => {
  it("crea una nueva palabra y la muestra en la lista", () => {
    cy.visit("/");

    // Completar formulario "Nueva palabra"
    cy.get("#textoNuevo").type("Cypress palabra");
    cy.get("#categoriaNueva").select("general");
    cy.get("#dificultadNueva").select("facil");
    cy.get("#idiomaNuevo").select("es");

    cy.contains("button", "Crear").click();

    // Verificar que aparece en la lista
    cy.contains("h3", "Cypress palabra").should("exist");
  });
});
