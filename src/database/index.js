import Sequelize from 'sequelize';

import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  };

  init(){
    this.connection = new Sequelize(databaseConfig); // Conexão com a base de dados, que está sendo esperada pela "init()" nos models!
   
    models.map(model => model.init(this.connection)); // for para acessar o array das classes e seus metodos
  };
}

export default new Database();