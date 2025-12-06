module.exports = {
  testEnvironment: "jsdom",

  // Buscar tests dentro de src/__tests__
  testMatch: ["**/__tests__/**/*.test.js"],

  clearMocks: true,

  // Activar coverage
  collectCoverage: true,
  coverageDirectory: "coverage",

  // De qué archivos queremos medir la cobertura
  collectCoverageFrom: [
    "src/**/*.jsx",
    "src/**/*.js",
    "!src/main.jsx"  // no hace falta medir el bootstrap
  ],

  // Reportes de coverage para Azure y SonarCloud
  coverageReporters: ["text", "html", "lcov", "cobertura", "json-summary"],
};
