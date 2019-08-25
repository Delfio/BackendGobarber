import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionsController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";

import authMiddleware from "./app/Middleware/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionsController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/providers", ProviderController.index);

routes.post("/files", upload.single("file"), FileController.store); //uploads de arquivos atraves do multer

export default routes;
