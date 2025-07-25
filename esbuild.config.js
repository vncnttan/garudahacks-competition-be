// esbuild.config.js
const path = require("path");
const { build } = require("esbuild");

// Match your tsconfig paths
const alias = {
  "@": path.resolve(__dirname, "src"),
  "@sockets": path.resolve(__dirname, "src/sockets"),
  "@config": path.resolve(__dirname, "src/config"),
  "@controllers": path.resolve(__dirname, "src/controllers"),
  "@databases": path.resolve(__dirname, "src/databases"),
  "@dtos": path.resolve(__dirname, "src/dtos"),
  "@exceptions": path.resolve(__dirname, "src/exceptions"),
  "@interfaces": path.resolve(__dirname, "src/interfaces"),
  "@middlewares": path.resolve(__dirname, "src/middlewares"),
  "@models": path.resolve(__dirname, "src/models"),
  "@routes": path.resolve(__dirname, "src/routes"),
  "@services": path.resolve(__dirname, "src/services"),
  "@utils": path.resolve(__dirname, "src/utils"),
  "@/generated/prisma": path.resolve(__dirname, "node_modules/.prisma/client"),
};

build({
  entryPoints: ["src/server.ts"], // your entry file
  outfile: "dist/server.js",
  platform: "node",
  bundle: true,
  target: "node20",
  sourcemap: true,
  alias,
  external: ["bcrypt"], // <-- don't bundle bcrypt
  logLevel: "info",
}).catch(() => process.exit(1));
