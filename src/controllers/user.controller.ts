import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { db } from "../database/connections";
import { AddressInsatance } from "../database/models/address";

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export class UserController {
  static registerUser = async (req: Request, res: Response) => {
    try {
      const doesUserExist = await db.dbInterface.models.User.findOne({ where: { [Op.or]: { email: req.body.email, username: req.body.username } } });
      if (doesUserExist) return res.status(400).send({ message: "user has been registered already" });
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await db.dbInterface.models.User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        role: "user",
      });
      let token = jwt.sign({ id: newUser.id, role: newUser.role, username: newUser.username }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
      return res.status(200).send({ message: "user registered successfully", token });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "registering user error" });
    }
  };

  static registerAdmin = async (req: Request, res: Response) => {
    try {
      const doesEmailExist = await db.dbInterface.models.User.findOne({ where: { email: req.body.email } });
      if (doesEmailExist) return res.status(400).send({ message: "email has been used registered already" });
      const existingAdmin = await db.dbInterface.models.User.findOne({ where: { username: req.body.username } });
      if (existingAdmin) return res.status(400).send({ message: "username has been used registered already" });
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await db.dbInterface.models.User.create(
        {
          username: req.body.username,
          email: req.body.email,
          password: hashPassword,
          role: "admin",
        },
        { returning: true }
      );
      let token = jwt.sign({ id: newUser.id, role: newUser.role, username: newUser.username }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
      return res.status(200).send({ message: "Admin  registered successfully", token });
    } catch (error) {
      return res.status(500).send({ message: "registering admin error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const user = await db.dbInterface.models.User.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(401).send({ message: "invalid email" });
      if (await bcrypt.compare(req.body.password, user.password)) {
        let token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
        return res.status(200).send({ message: "user logged in successfully", token });
      } else {
        return res.status(401).send({ message: "invalid password" });
      }
    } catch (error) {
      return res.status(500).send({ message: "error loggin in" });
    }
  };

  static addAddress = async (req: Request, res: Response) => {
    try {
      const { userId, name, company, phone, address, city, country, state, pincode, type, isDefault } = req.body;
      if (isDefault) {
        await db.dbInterface.models.Address.update(
          {
            isDefault: false,
          },
          { where: { isDefault: true } }
        );
      }
      let newAddress = await db.dbInterface.models.Address.create(
        {
          userId,
          name,
          company,
          phone,
          address,
          city,
          country,
          state,
          isDeleted:false,
          pincode,
          type,
          isDefault,
        },
        { returning: true }
      );

      return res.status(200).send({ message: "address has been added", address: newAddress });
    } catch (error) {
      return res.status(500).send({ message: "error adding address" });
    }
  };

  static updateAddress = async (req: Request, res: Response) => {
    try {
      const { id, userId, name, company, phone, address, city, country, state, pincode, type, isDefault } = req.body;
      if (isDefault) {
        await db.dbInterface.models.Address.update(
          {
            isDefault: false,
          },
          { where: { isDefault: true } }
        );
      }
      await db.dbInterface.models.Address.update(
        {
          isDeleted:true
        },
        { where: { userId: userId, id: id } }
      );
      let info = await db.dbInterface.models.Address.create(
        {
           userId, name, company, phone, address, city, country, state, pincode, type, isDefault,isDeleted:false
        },
      );

      return res.status(200).send({ message: "address has been updated", updateInfo: info });
    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: "error updating address" });
    }
  };

  static getAddresses = async (req: Request, res: Response) => {
    try {
      let addresses = await db.dbInterface.models.Address.findAll({
        where: { userId: req.params.userId,isDeleted:false },
        order: ["createdAt"],
      });
      return res.status(200).send({ message: "addresses has been sent", addresses: addresses });
    } catch (error) {
      return res.status(500).send({ message: "error sending addresses" });
    }
  };

  static getAddress = async (req: Request, res: Response) => {
    try {
      let address = await db.dbInterface.models.Address.findOne({
        where: { id: req.params.addressId }
      });
      return res.status(200).send({ message: "address has been sent", address: address });
    } catch (error) {
      return res.status(500).send({ message: "error sending address" });
    }
  };

  static removeAddress = async (req: Request, res: Response) => {
    try {
      let address = await db.dbInterface.models.Address.destroy({
        where: { id: req.params.addressId }
      });
      return res.status(200).send({ message: "address has been deleted", address: address });
    } catch (error) {
      return res.status(500).send({ message: "error at deleting address" });
    }
  };

  static verifyAdmin = async (req: Request, res: Response) => {
    try { 
      if (!req.currentUser) {
        return res.status(401).send({ message: 'Please provide a valid token.' });
    }
    if (req.currentUser.role !== 'admin') {
        return res.status(403).send({ message: 'You are not authorized to perform this action.' });
    }
    return res.status(200).send({ message: "Admin authorized"  });
  } catch (error) {}
  };
}
  
