import{Sequelize} from 'sequelize'
import { UserInstance } from '../models/user'
import { ProductInstance } from '../models/product'
import { OrderInsatance } from '../models/order'
import { OrderItemsInsatance } from '../models/orderItem' //?
import {AddressInsatance} from '../models/address'
import { CustomModel } from './customModel'
import { ProductEntriesInsatance } from '../models/productEntry'
import { ColourInsatance } from '../models/colour'
import { SizeInsatance } from '../models/size'
import { CouponInfoInsatance } from '../models/couponInfo'
import { CouponAssignedInsatance } from '../models/couponAssigned'

export interface DbInterface{
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    models:{
        User: CustomModel<UserInstance>
        Product: CustomModel<ProductInstance>
        Order: CustomModel<OrderInsatance>
        OrderItem: CustomModel<OrderItemsInsatance>
        Address: CustomModel<AddressInsatance>
        ProductEntry: CustomModel<ProductEntriesInsatance>
        Colour: CustomModel<ColourInsatance>
        Size: CustomModel<SizeInsatance>
        CouponInfo: CustomModel<CouponInfoInsatance>
        CouponAssigned: CustomModel<CouponAssignedInsatance>
        
    }
}

export type AllDBModels = DbInterface['models']