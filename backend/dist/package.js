// package.json
var name = "backend";
var version = "1.0.0";
var description = "";
var main = "index.js";
var engines = {
  node: "16"
};
var scripts = {
  build: "tsup src package.json",
  start: "node dist/server.js",
  dev: "npm run prisma:apply && npm run prisma:seed:dev && tsx watch src/server.ts",
  test: "jest",
  "prisma:seed:dev": "ts-node src/prisma/seed.ts",
  "prisma:apply": "prisma db push --schema=./prisma/schema.prisma"
};
var prisma = {
  seed: "ts-node src/prisma/seed.ts"
};
var keywords = [];
var author = "";
var license = "ISC";
var devDependencies = {
  "@swc/core": "^1.3.104",
  "@swc/jest": "^0.2.30",
  "@types/jest": "^29.5.11",
  "@types/node": "^20.11.5",
  "@types/supertest": "^6.0.2",
  "@typescript-eslint/eslint-plugin": "^6.19.0",
  eslint: "^8.56.0",
  "eslint-config-standard-with-typescript": "^43.0.0",
  "eslint-plugin-import": "^2.29.1",
  "eslint-plugin-n": "^16.6.2",
  "eslint-plugin-promise": "^6.1.1",
  "eslint-plugin-react": "^7.33.2",
  jest: "^29.7.0",
  prisma: "^5.8.1",
  supertest: "^6.3.4",
  "ts-node": "^10.9.2",
  typescript: "^5.3.3"
};
var dependencies = {
  "@fastify/cors": "^8.5.0",
  "@prisma/client": "^5.8.1",
  "@types/joi": "^17.2.3",
  "@types/jsonwebtoken": "^9.0.5",
  fastify: "^4.25.2",
  joi: "^17.12.0",
  jsonwebtoken: "^9.0.2",
  tsup: "^8.0.1",
  tsx: "^4.7.0"
};
var package_default = {
  name,
  version,
  description,
  main,
  engines,
  scripts,
  prisma,
  keywords,
  author,
  license,
  devDependencies,
  dependencies
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  author,
  dependencies,
  description,
  devDependencies,
  engines,
  keywords,
  license,
  main,
  name,
  prisma,
  scripts,
  version
});
