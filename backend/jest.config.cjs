module.exports = {
  testEnvironment: "node",

  // Qué archivos son considerados tests
  testMatch: ["**/__tests__/**/*.test.js"],

  // Limpiar mocks automáticamente
  clearMocks: true,

  // Activar generación de coverage siempre
  collectCoverage: true,

  // Dónde guardar los reportes de coverage
  coverageDirectory: "coverage",

  // Qué archivos queremos medir para coverage
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js"  // no medimos el servidor
  ],

  // Formatos de salida de coverage
  // - lcov y json-summary los puede usar SonarCloud
  // - html para ver el reporte en el navegador
  // - cobertura para que Azure DevOps dibuje los gráficos
  coverageReporters: ["text", "html", "lcov", "cobertura", "json-summary"],

  // Quality gate local (mínimo recomendado por la cátedra)
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 30,
      functions: 30,
      lines: 30,
    },
  },
};
