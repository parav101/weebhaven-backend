import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface UserAttributes {
  id?: string;
  username: string;
  role: string;
  email: string;
  password: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>,UserAttributes{ };

export const UserFactory = (sequelize:Sequelize)=>{
  const attributes ={
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique:true
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique:true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  };
  const User: CustomModel<UserInstance> = sequelize.define<UserInstance, UserAttributes>('User', attributes);
  User.associate = models=>{
    User.hasMany(models.Address,{ sourceKey: 'id',foreignKey:'UserId' })
    User.hasMany(models.Order,{ sourceKey: 'id',foreignKey:'UserId' })
  }
  return User;
}

