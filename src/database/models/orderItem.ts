import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface OrderItemsAttributes {
  id?: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  category: string;
  size: string;
  colour: string;
  quantity: Number;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface OrderItemsInsatance extends Model<OrderItemsAttributes>,OrderItemsAttributes{ };


export const OrderItemFactory = (sequelize:Sequelize)=>{
  const attributes = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    orderId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'orders',
        key:'id'
      }
    },
    productId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'products',
        key:'id'
      }
    },
    productName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    productImage: {
      type: DataTypes.STRING
    },
    productPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    category: {
      type: DataTypes.STRING
    },
    size: {
      allowNull: false,
      type: DataTypes.STRING
    },
    colour: {
      allowNull: false,
      type: DataTypes.STRING
    },
    quantity: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }

  const OrderItem: CustomModel<OrderItemsInsatance> = sequelize.define<OrderItemsInsatance, OrderItemsAttributes>('OrderItem', attributes);
  OrderItem.associate = models=>{
    OrderItem.belongsTo(models.Order,{foreignKey:'orderId'})
    OrderItem.belongsTo(models.Product,{foreignKey:'productId'})
  }
  
  return OrderItem;
}

