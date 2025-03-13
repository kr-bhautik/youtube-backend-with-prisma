import express from 'express'
import { handleRegister } from '../controllers/user.controller';
import { loginHandle } from '../controllers/user.controller';
import { logoutHandle } from '../controllers/user.controller';
import { profileHandle } from '../controllers/user.controller';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware';
import { videosHandle } from '../controllers/user.controller';

const app = express();
const userRouter = express.Router();

app.use(express.urlencoded({extended: true}))

userRouter.post('/register', handleRegister)
userRouter.post('/login',loginHandle )
userRouter.get('/logout', logoutHandle)
userRouter.get('/profile', isLoggedIn,  profileHandle)
userRouter.get('/videos', isLoggedIn, videosHandle)

export {
    userRouter
}