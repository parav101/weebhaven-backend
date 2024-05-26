import { DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface ProductAttributes {
  id?: string;
  productName: string;
  productDesc: string;
  orderIndex: number;
  category: string;
  isFeatured: boolean;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

export interface ProductInstance extends Model<ProductAttributes>,ProductAttributes{
  ProductEntries: {}[];
};


export const ProductFactory = (sequelize:Sequelize)=>{
  const attributes ={
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    productName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productDesc: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    orderIndex: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isFeatured: {
      defaultValue:false,
      type: DataTypes.BOOLEAN
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
  const Product: CustomModel<ProductInstance> = sequelize.define<ProductInstance, ProductAttributes>('Product', attributes);
  Product.associate = models=>{
    Product.hasMany(models.ProductEntry,{ sourceKey: 'id',foreignKey:'productId' })
  }
  return Product;
}
