import User from '../models/User';

class UserController{
  async store(req, res){
    const userExists = await User.findOne({ where: { email: req.body.email }}); //percorre a tabela de users e verifica o email enviado com os existentes
    if(userExists){
      return res.status(400).json({ error: 'User already exists.' });// Se existir algum cadastro com esse email, ele retorna um erro
    }

    const { id, name, email, provider } = await User.create(req.body); // pegando os dados que vem do req.body | e retornando somente o necessário atraves da desestruturação!

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new UserController();