//Toda configuração da parte de upload de arquivos (yarn add multer) - arquivo base /temp/uploads
import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "temp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString("hex") + extname(file.originalname)); //formatando a entrada do nome do arquivo
      });
    }
  })
};
