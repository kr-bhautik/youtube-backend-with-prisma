import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv'
import { userInteface } from "../utils/types";
import { getPayload } from "../utils/jwt/verifyToken";
import { prisma } from "../db/db.config";
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const isLoggedIn = async(req:Request, res:Response, next:NextFunction) => {

    if(!req.cookies.token){
        res.status(400).send({
            status: "failure",
            message: "Login first."
        })
        return;
    }

    const userId  = await getPayload(req.cookies.token) || ""
    const parsedUserId = parseInt(userId);
    const user = await prisma.user.findUnique({
        where: {
            userId : parsedUserId
        }
    })
    if(!user) {
        res.status(400).send({
            status: "failure",
            message: "Login first."
        })
        return;
    }
    req.userInfo = user as unknown as userInteface;
    next();
}