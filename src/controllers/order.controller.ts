import { Request, Response } from "express";
import { db } from "../database/connections";
import { UUID } from "crypto";
import { Order, Sequelize, Transaction } from "sequelize";
import { error } from "console";

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export class orderController {
  static addOrder = async (req: Request, res: Response) => {
    let transaction: Transaction = await db.transaction();
    try {
      const userId = req.currentUser.id;
      const { totalItems, status, extra, deleviryDate, addressId, cartItems, coupon } = req.body;
      let newtotal = 0;
      let couponFound;
      let newCart: any = [];
      let flag = false;

      for (let index = 0; index < cartItems.length; index++) {
        let cartItem: any;
        cartItem = await db.dbInterface.models.Product.findOne({
          raw: true,
          nest: true,
          where: { id: cartItems[index].productId },
          attributes: ["productName", "category"],
          include: [
            {
              model: db.dbInterface.models.ProductEntry,
              where: { id: cartItems[index].productEntryId },
              attributes: ["productPrice", "productImage", "discountedPrice"],
              required: true,
            },
          ],
        });
        if (!cartItem) throw Error("Invaild cartItem");
        newCart.push({ ...cartItem, quantity: cartItems[index].quantity, productId: cartItems[index].productId, size: cartItems[index].size, colour: cartItems[index].colour });
        newtotal = newtotal + cartItem.ProductEntries.discountedPrice * cartItems[index].quantity;
      }
      if (coupon) {
        couponFound = await db.dbInterface.models.CouponInfo.findOne({
          where: { code: coupon },
          include: [
            {
              model: db.dbInterface.models.CouponAssigned,
              where: { userId: userId },
              required: false,
            },
          ],
        });
        if (!couponFound) throw new Error("Coupon does not exist");
        if (couponFound.validOnce && couponFound.CouponAssigneds.length >= 1) throw new Error("Coupon had been used already");
        if (newtotal < couponFound.minAmount) throw new Error("Order amount is too low to use Coupon");
        flag = true;
        if (couponFound.type == "total") newtotal = newtotal - couponFound.discountValue; 
        else newtotal = newtotal - (newtotal * couponFound.discountValue) / 100;
      }

      let newOrder: any = await db.dbInterface.models.Order.create(
        {
          userId,
          addressId,
          totalItems,
          status,
          total: newtotal,
        },
        { raw: true, transaction }
      );
      newCart = newCart.map((item: any) => ({ ...item, orderId: newOrder.id, productPrice: item.ProductEntries.productPrice, discountedPrice: item.ProductEntries.discountedPrice, productImage: item.ProductEntries.productImage }));
      const orderItems = await db.dbInterface.models.OrderItem.bulkCreate(newCart, { returning: true, transaction });

      if (flag && couponFound!.id) await db.dbInterface.models.CouponAssigned.create({ orderId: newOrder.id, userId, couponInfoId: couponFound!.id }, { transaction });
      await transaction.commit();
      return res.status(200).send({ message: "Order has been added", newOrder, orderItems });
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.status(500).send({ message: "Order add error" });
    }
  };

  static viewOrder = async (req: Request, res: Response) => {
    try {
      const order: any = await db.dbInterface.models.Order.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: db.dbInterface.models.OrderItem,
            required: true,
          },
          {
            model: db.dbInterface.models.Address,
            required: true,
          },
        ],
      });
      return res.status(200).send({ message: "Order are showing", order: order });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({ message: "Order viewing error" });
    }
  };

  static updateOrder = async (req: Request, res: Response) => {
    let transaction: Transaction = await db.transaction();
    try {
      const doesOrderExist = await db.dbInterface.models.Order.findOne({ where: { id: req.body.orderId } });
      if (!doesOrderExist) return res.status(400).send({ message: "Order doesn't exists" });
      const { userId, addressId, totalItems, status } = req.body;
      await db.dbInterface.models.Order.update(
        {
          userId,
          addressId,
          totalItems,
          status,
        },
        { where: { id: doesOrderExist.id }, transaction }
      );

      await transaction.commit();
      return res.status(200).send({ message: "Order has been updated" });
    } catch (error) {
      await transaction.rollback();
      // console.log(error);
      return res.status(500).send({ message: "Order update error" });
    }
  };

  static viewAllOrders = async (req: Request, res: Response) => {
    try {
      const orders: any = await db.dbInterface.models.Order.findAll({
        where: { userId: req.currentUser.id },
        include: [
          {
            model: db.dbInterface.models.OrderItem,
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).send({ message: "Order are showing", allOrders: orders });
    } catch (error) {
      return res.status(500).send({ message: "Order viewing error" });
    }
  };

  static viewAllOrdersAdmin = async (req: Request, res: Response) => {
    try {
      const orders: any = await db.dbInterface.models.Order.findAll({
        include: [
          {
            model: db.dbInterface.models.User,
            attributes: ["username"],
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).send({ message: "Order are showing", allOrders: orders });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Order viewing error" });
    }
  };

  static deleteOrder = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };

  static addCouponInfo = async (req: Request, res: Response) => {
    try {
      const { code, desc, type, minAmount, discountValue, validOnce, isVisible, expiryDate } = req.body;
      let couponInfo = await db.dbInterface.models.CouponInfo.create({
        code,
        desc,
        type,
        minAmount,
        discountValue,
        validOnce,
        isVisible,
        expiryDate,
      });
      return res.status(200).send({ message: "CouponInfo", couponInfo });
    } catch (error) {
      console.log(error);
      return res.status(500).send("error at adding couponInfo");
    }
  };

  //need to check user id too before sending couponassinged
  static viewCoupon = async (req: Request, res: Response) => {
    try {
      let singleCoupon;
      let allCoupons;
      if (req.params.code) {
        let coupon = await db.dbInterface.models.CouponInfo.findOne({
          where: { code: req.params.code },
          include: [
            {
              model: db.dbInterface.models.CouponAssigned,
              where: { userId: req.currentUser.id },
              required: false,
            },
          ],
        });
        if (!coupon) return res.status(500).send("Coupon does not exist");
        if (coupon.validOnce && coupon.CouponAssigneds.length >= 1) return res.status(500).send("Coupon used already");
        singleCoupon = { code: coupon.code, desc: coupon.desc, minAmount: coupon.minAmount, type: coupon.type, discountValue: coupon.discountValue };
      } else {
        let coupon = await db.dbInterface.models.CouponInfo.findAll({
          attributes: ["id", "code", "desc", "validOnce"],
          where: { isVisible: true },
          include: [
            {
              model: db.dbInterface.models.CouponAssigned,
              where:{userId:req.currentUser.id},
              required: false,
            },
          ],
        });
        //logic for single use item.CouponAssigned.length !== 0 ||
        //add logic for multiuse coupon
        coupon = [...coupon?.filter((item) => item.CouponAssigneds.length == 0 || !item.validOnce)];
        allCoupons = coupon;
        singleCoupon = allCoupons![0];
      }

      return res.status(200).send({ message: "CouponInfo", singleCoupon, allCoupons });
    } catch (error) {
      console.log(error);
      return res.status(500).send("error to view coupons");
    }
  };
}
