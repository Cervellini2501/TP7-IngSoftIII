module.exports = {
  testEnvironment: "node",

  // Qué archivos son considerados tests
  testMatch: ["**/__tests__/**/*.test.js"],

  // Limpiar mocks automáticamente
  clearMocks: true,

  // Dónde guardar los reportes de coverage
  coverageDirectory: "coverage",

  // Qué archivos queremos medir para coverage
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js"  // no medimos el servidor
  ],

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
