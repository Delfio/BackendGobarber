import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // campo que não existe na base de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );
    
    /** 
    Trecho de codigo que
     são executados de forma automáticas, baseadas em ações que acontece no model.
     beforeSave, beforeUpdate, beforeCreate - antes da ...
    */    

     this.addHook("beforeSave", async user => {
      // isso tudo pra criptografar a senha tnc
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8); // Fazendo uma
      }//verificação e criando um hash de força 8 e jogando pro banco.
    });

    return this;
  }

  static associate(models) {
    //Relacionamento de fk
    this.belongsTo(models.File, { foreignKey: "avatar_id", as: "avatar" });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash); 
  } 
}

export default User;
