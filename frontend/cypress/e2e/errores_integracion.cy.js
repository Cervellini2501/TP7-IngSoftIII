describe("Manejo de errores de integración frontend-backend", () => {
  it("muestra un mensaje de error si el backend falla al cargar palabras", () => {
    cy.intercept("GET", "**/api/palabras", {
      statusCode: 500,
      body: { error: "Falla simulada" },
    }).as("getPalabrasError");

    cy.visit("/");

    cy.wait("@getPalabrasError");

    cy.contains("Error al obtener palabras").should("be.visible");
  });
});
