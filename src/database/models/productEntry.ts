import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface ProductEntriesAttributes {
  id?: string;
  productId: string;
  sizeId: string;
  colourId: string;
  productImage: string;
  productPrice: number;
  discountedPrice: number;
  inStock: boolean;
  title?:string;
  qty: Number;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface ProductEntriesInsatance extends Model<ProductEntriesAttributes>,ProductEntriesAttributes{ };


export const ProductEntriesFactory = (sequelize:Sequelize)=>{
  const attributes = {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    productId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'products',
        key:'id'
      }
    },
    sizeId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'sizes',
        key:'id'
      }
    },
    colourId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'colours',
        key:'id'
      }
    },
    title: {
      type: DataTypes.STRING
    },
    productImage: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    discountedPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    inStock: {
      defaultValue:true,
      type: DataTypes.BOOLEAN
    },
    qty: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }

  const ProductEntries: CustomModel<ProductEntriesInsatance> = sequelize.define<ProductEntriesInsatance, ProductEntriesAttributes>('ProductEntry', attributes);
  ProductEntries.associate = models=>{
    ProductEntries.belongsTo(models.Product,{foreignKey:'productId'})
    ProductEntries.belongsTo(models.Colour,{foreignKey:'colourId'})
    ProductEntries.belongsTo(models.Size,{foreignKey:'sizeId'})
  }
  
  return ProductEntries;
}

