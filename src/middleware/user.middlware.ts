import { error } from "console";
import express from "express";
import { Request, Response, NextFunction} from 'express'
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
import { db } from "../database/connections";


declare global {
    namespace Express {
        interface Request {
            currentUser?: any
        }
    }
}

export const currentUser = (req:Request,res:Response,next:NextFunction) =>{
    try {
        if(!req.headers.authorization) return res.status(401).send({"message": "not authorized"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).send({"message": "Please provide a valid token."});
        if(!process.env.JWT_SECRET) throw Error("invalid key")
        const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET,);
        // const {id,role,username} = decodedToken
        db.dbInterface.models.User.findOne({where:{id:decodedToken.id},attributes:['id','username','role']}).then(user=>{
            if(user){
                req.currentUser = user;
                return next();
            }else{
                return res.status(401).send({ message: "Invaild User id" });
            }
        })
        
    } catch (error) {
        return res.status(401).send({ message: "user token error" });
    }
}