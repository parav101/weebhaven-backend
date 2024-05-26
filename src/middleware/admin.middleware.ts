import { error } from "console";
import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { db } from "../database/connections";

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;
    }
  }
}

export const AdminRoleRequired = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.currentUser) {
        return res.status(401).send({ message: 'Please provide a valid token.' });
    }
    if (req.currentUser.role !== 'admin') {
        return res.status(403).send({ message: 'You are not authorized to perform this action.' });
    }
    return next();
  } catch (error) {}
};
