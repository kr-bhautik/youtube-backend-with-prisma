import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

export const generateToken = async(userId:string) => {
    try {
        return await jwt.sign({userId}, JWT_SECRET||"");
    } catch (error) {
        console.log("Some error Occured. :\n", error)
    }
}