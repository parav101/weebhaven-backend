import { CharDataType, DataTypes, Model, Sequelize } from "sequelize";
import { CustomModel } from "../typings/customModel";

interface CouponAssignedAttributes {
  id?: string;
  orderId?: string;
  userId: string;
  couponInfoId: string;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface CouponAssignedInsatance extends Model<CouponAssignedAttributes>,CouponAssignedAttributes{ };


export const CouponAssignedFactory = (sequelize:Sequelize)=>{
  const attributes = {
    id: {
      allowNull: false,
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
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'users',
        key:'id'
      }
    },
    couponInfoId: {
      allowNull: false,
      type: DataTypes.UUID,
      references:{
        model:'couponInfos',
        key:'id'
      }
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

  const CouponAssigned: CustomModel<CouponAssignedInsatance> = sequelize.define<CouponAssignedInsatance, CouponAssignedAttributes>('CouponAssigned', attributes, {
    tableName: "CouponAssigned"
  });
  CouponAssigned.associate = models=>{
    CouponAssigned.belongsTo(models.Order,{foreignKey:'orderId'})
    CouponAssigned.belongsTo(models.User,{foreignKey:'userId'})
    CouponAssigned.belongsTo(models.CouponInfo,{foreignKey:'couponInfoId'})
  }
  
  return CouponAssigned;
}

