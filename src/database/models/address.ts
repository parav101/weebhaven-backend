import { DataTypes, EnumDataType, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

// enum AddressType {
//   'shipping', 'billing'
// }

interface AddressAttributes {
  id?: string;
  userId: string;
  name: string;
  company?: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  state: string;
  pincode: number;
  type: string;
  isDefault:boolean;
  isDeleted:boolean;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

export interface AddressInsatance extends Model<AddressAttributes>,AddressAttributes{ };

export const AddressFactory = (sequelize:Sequelize)=>{
  const attributes ={
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'Users',
        key:'id'
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.CHAR(11)
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.CHAR
    },
    country: {
      type: DataTypes.CHAR
    },
    state: {
      type: DataTypes.CHAR
    },
    pincode: {
      type: DataTypes.INTEGER
    },
    type:{
      type:   DataTypes.ENUM('shipping', 'billing'),
      defaultValue :  'shipping'
    },
    isDefault: {
      type: DataTypes.BOOLEAN
    },
    isDeleted: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  };
  const Address: CustomModel<AddressInsatance> = sequelize.define<AddressInsatance, AddressAttributes>('Address', attributes);
  Address.associate = models=>{
    Address.belongsTo(models.User,{foreignKey:'userId'})
    Address.hasMany(models.Order,{ sourceKey: 'id',foreignKey:'addressId' })
  }
  return Address;
}

