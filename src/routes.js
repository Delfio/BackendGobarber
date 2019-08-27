import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import AppointmentController from "./app/controllers/AppointmentController";
import UserController from "./app/controllers/UserController";
import SessionsController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";

import authMiddleware from "./app/Middleware/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);// Criação de usuarios
routes.post("/sessions", SessionsController.store);// Criação de sesão

routes.use(authMiddleware); // Todas as rotas a partir daqui, terão que passar por este auth

routes.put("/users", UserController.update);// Update de usúarios

routes.get("/providers", ProviderController.index);// Listagem de providers - prestadores de serviços

routes.post("/appointments", AppointmentController.store); //Criação de serviços
routes.get("/appointments", AppointmentController.index); //Listagem de serviços

routes.post("/files", upload.single("file"), FileController.store); //uploads de arquivos atraves do multer

export default routes;
