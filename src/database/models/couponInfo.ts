import { CharDataType, DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface CouponInfoAttributes {
  id?: string;
  code:string;
  desc:string;
  type:string; //total or specific
  minAmount:number;
  discountValue:number;
  validOnce:boolean;
  isVisible:boolean;
  expiryDate?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface CouponInfoInsatance extends Model<CouponInfoAttributes>,CouponInfoAttributes{
  CouponAssigneds: {}[];
};


export const CouponInfoFactory = (sequelize:Sequelize)=>{
  const attributes = {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4 
    },
    code: {
      allowNull: false,
      type: DataTypes.CHAR
    },
    desc: {
      allowNull: false,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.CHAR
    },
    minAmount: {
      allowNull: false,
      type: DataTypes.NUMBER
    },
    discountValue: {
      allowNull: false,
      type: DataTypes.NUMBER
    },
    validOnce: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    expiryDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
  }

  const CouponInfo: CustomModel<CouponInfoInsatance> = sequelize.define<CouponInfoInsatance, CouponInfoAttributes>('CouponInfo', attributes);
  CouponInfo.associate = models=>{
    CouponInfo.hasMany(models.CouponAssigned,{ sourceKey: 'id',foreignKey:'CouponInfoId' })
  }
  
  return CouponInfo;
}

