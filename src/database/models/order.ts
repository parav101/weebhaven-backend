import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";


interface OrderAttributes {
  id?: string;
  userId: string;
  addressId: string;
  totalItems: number;
  status:string;
  total:number;
  extra?:number;
  deleviryDate?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

export interface OrderInsatance extends Model<OrderAttributes>,OrderAttributes{ };

export const OrderFactory = (sequelize:Sequelize)=>{
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
    addressId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'Addresses',
        key:'id'
      }
    },
    totalItems: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    },
    extra: {
      type: DataTypes.INTEGER
    },
    deleviryDate: {
      type: DataTypes.DATE
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
  const Order: CustomModel<OrderInsatance> = sequelize.define<OrderInsatance, OrderAttributes>('Order', attributes);
  Order.associate = models=>{
    Order.belongsTo(models.User,{foreignKey:'userId'})
    Order.belongsTo(models.Address,{foreignKey:'addressId'})
    Order.hasMany(models.OrderItem,{ sourceKey: 'id',foreignKey:'orderId' })
  }
  return Order;
}

