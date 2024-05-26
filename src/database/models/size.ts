import { CharDataType, DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface SizeAttributes {
  id?: string;
  size_value:string;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface SizeInsatance extends Model<SizeAttributes>,SizeAttributes{ };


export const SizeFactory = (sequelize:Sequelize)=>{
  const attributes = {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    size_value: {
      allowNull: false,
      type: DataTypes.CHAR
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

  const Size: CustomModel<SizeInsatance> = sequelize.define<SizeInsatance, SizeAttributes>('Size', attributes);
  Size.associate = models=>{
    Size.hasMany(models.ProductEntry,{ sourceKey: 'id',foreignKey:'sizeId' })
  }
  
  return Size;
}

