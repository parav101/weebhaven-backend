import { CharDataType, DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface ColourAttributes {
  id?: string;
  colour_value:string;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface ColourInsatance extends Model<ColourAttributes>,ColourAttributes{ };


export const ColourFactory = (sequelize:Sequelize)=>{
  const attributes = {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    colour_value: {
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

  const Colour: CustomModel<ColourInsatance> = sequelize.define<ColourInsatance, ColourAttributes>('Colour', attributes);
  Colour.associate = models=>{
    Colour.hasMany(models.ProductEntry,{ sourceKey: 'id',foreignKey:'colourId' })
  }
  
  return Colour;
}

