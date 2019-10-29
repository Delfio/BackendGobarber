import 'dotenv/config';
//process.env

import express from "express";
import Path from "path";
import cors from "cors";
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from "./routes";
import sentryConfig from './config/sentry';

import "./database";

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionsHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    //passar o end ip da aplicação que vai acessar
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      // PERMITIR QUE O NAVEGADOR EXIBA AS IMAGENS GERADAS PELO LINK SEM NECESSIDADE DE "AUTH"
      "/files",
      express.static(Path.resolve(__dirname, "..", "temp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }
  exceptionsHandler(){
    this.server.use(async (err, req, res, next) =>{
      if(process.env.NODE_ENV === 'development'){
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({error: 'Erro de servidor, Porfavor contate o suporte'});
    });
  }

}

export default new App().server;
