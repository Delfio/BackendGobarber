import User from "../models/User";
import File from "../models/File";

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ["id", "name", "email", "avatar_id"],
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["name", "path", "url"] //formatando a informação da imagem que será enviada para o front end!
        } //Utilizando o url para gerar o link do servidor para a aplicação -Devido ao fato da imagem ficar no -
      ] //servidor a parte!. OBS: Foi feito uma config para acessar a imagem sem a Necessidade de autenticação
    }); // - File.js - App.js.

    return res.json(providers);
  }
}

export default new ProviderController();
