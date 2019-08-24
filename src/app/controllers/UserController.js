import * as Yup from 'yup';
import User from '../models/User';

class UserController{
  async store(req, res){
    const schema = Yup.object().shape({
      name:
        Yup.string().required(),

      email:
        Yup.string().required().email(),

      password:
        Yup.string().required().min(6)
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Dados invalidos' })
    }

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
  };
  async update(req, res){
    const schema = Yup.object().shape({
      name:
        Yup.string(),

      email:
        Yup.string().email(),

      oldPassword:
        Yup.string().min(6),

      password:
        Yup.string().min(6).when('oldPassword', (oldPassword, field) => 
        oldPassword ? field.required(): field
        ),

        confirmPassword:
          Yup.string().when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if(email != user.email){
      const userExists = await User.findOne({ where: { email }}); //percorre a tabela de users e verifica o email enviado com os existentes
    
      if(userExists){
        return res.status(400).json({ error: 'Email para update já em uso' });// Se existir algum cadastro com esse email, ele retorna um erro
      } 
    }

    if(oldPassword && !(await user.checkPassword(oldPassword))){
      return res.status(401).json({ error: 'Senha Inserida não bate com a atual' })
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ 
      id,
      name,
      email,
      provider 
    });
  }

}

export default new UserController();