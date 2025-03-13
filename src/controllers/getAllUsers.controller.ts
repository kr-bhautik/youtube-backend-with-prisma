import mongoose from "mongoose";
import { Request, Response } from "express";
import { prisma } from "../db/db.config";

export const getUsersHandle = async(req:Request, res:Response) => {

    const users = await prisma.user.findMany({
      where:{}  
    })
    
    if(!users){
        res.status(204).send({
            status: "success",
            message: "No users..."
        })
        return;
    }

    res.status(200).send({
        status: "success",
        message: "Users fetched successfully...",
        users
    })
}