import express from 'express';
import { orderController } from '../controllers/order.controller';
import { AdminRoleRequired } from '../middleware/admin.middleware';

const router = express.Router();


router.post('/add-order', orderController.addOrder)
router.post('/add-couponInfo',AdminRoleRequired,orderController.addCouponInfo)
router.get('/view-coupon',orderController.viewCoupon)
router.get('/view-coupon/:code',orderController.viewCoupon)
router.get('/view-orders/:userId',orderController.viewAllOrders)
router.get('/view-allorders',AdminRoleRequired, orderController.viewAllOrdersAdmin)
router.put('/update-order',AdminRoleRequired, orderController.updateOrder)
router.get('/view-order/:id',orderController.viewOrder)

export default router;