import express, { Request, Response } from 'express'
import { userRouter } from './routes/user.route';
import dotenv from 'dotenv'
import { prisma } from './db/db.config';
import cookieParser from 'cookie-parser';
import { getUsersHandle } from './controllers/getAllUsers.controller';
import { videoRouter } from './routes/video.route';

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.get('/', (req:Request, res:Response) => {
    res.send("Hello")
})
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})

app.use('/user', userRouter);
app.get('/users', getUsersHandle)
app.use('/user/video', videoRouter)