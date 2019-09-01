import Sequelize from "sequelize";
import mongoose from "mongoose";

import User from "../app/models/User";
import File from "../app/models/File";
import Appointment from "../app/models/Appointment";


import databaseConfig from "../config/database";

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // Conexão com a base de dados, que está sendo esperada pela "init()" nos models!

    models
      .map(model => model.init(this.connection)) // for para acessar o array das classes e seus metodos
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo(){
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
