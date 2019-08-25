import express from "express";
import routes from "./routes";
import Path from "path";

import "./database";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      // PERMITIR QUE O NAVEGADOR EXIBA AS IMAGENS GERADAS PELO LINK SEM NECESSIDADE DE "AUTH"
      "/files",
      express.static(Path.resolve(__dirname, "..", "temp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
