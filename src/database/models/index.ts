import { Sequelize } from "sequelize";
import { DbInterface } from "../typings/DbInterface";
import { UserFactory } from "./user";
import { OrderItemFactory } from "./orderItem"; //?
import { OrderFactory } from "./order";
import { AddressFactory } from "./address";
import { ProductFactory } from "./product";
import { ProductEntriesFactory } from "./productEntry";
import { ColourFactory } from "./colour";
import { SizeFactory } from "./size";
import { CouponAssignedFactory } from "./couponAssigned";
import { CouponInfoFactory } from "./couponInfo";

export const createModels = (sequelize: Sequelize): DbInterface => {
  const db: DbInterface = {
    sequelize,
    Sequelize: Sequelize,
    models: {
      User: UserFactory(sequelize),
      Order: OrderFactory(sequelize),
      Product: ProductFactory(sequelize),
      OrderItem: OrderItemFactory(sequelize),
      Address: AddressFactory(sequelize),
      ProductEntry: ProductEntriesFactory(sequelize),
      Colour: ColourFactory(sequelize),
      Size: SizeFactory(sequelize),
      CouponAssigned: CouponAssignedFactory(sequelize),
      CouponInfo: CouponInfoFactory(sequelize),
    },
  };

  for (let model in db.models) {
    let m = db.models[model as keyof typeof db.models];
    if (m.associate) {
      m.associate(db.models);
    }
  }

  return db;
};
