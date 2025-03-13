import express from 'express'
import { deleteHandle, getVideoHandle, likeHandle, uploadHandle } from '../controllers/video.controller';
import { upload } from '../middlewares/multer.middleware';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware';

export const videoRouter = express.Router();

videoRouter.post('/', isLoggedIn, upload.single('uploaded_video') , uploadHandle)
videoRouter.get('/get/:videoId', getVideoHandle)
videoRouter.delete('/delete/:videoId', isLoggedIn, deleteHandle)

videoRouter.get('/like/:videoId', isLoggedIn, likeHandle)