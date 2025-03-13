import { Request, Response } from "express";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { getPayload } from "../utils/jwt/verifyToken";
import { prisma } from "../db/db.config";
import fs from 'fs'

export const uploadHandle = async(req:Request, res:Response) => {
    // console.log(req.file)
    const {title, description} = req.body;
    if( !req.file || !title || !description){
        res.status(400).send({
            status: "failure",
            message: "All fields are mandatory.."
        })
        return;
    }
    const localFilePath = req.file.path;
    const response = await uploadOnCloudinary(localFilePath);
    // console.log(response?.public_id)
    if(!response){
        res.status(501).send({
            status: "failure",
            message: "Something went wrong."
        })
        return;
    }
    const userId = await getPayload(req.cookies.token)||"";
    const parsedUserId = parseInt(userId);
    const newPost = await prisma.video.create({
        data: {
            title, 
            description,
            videoLink: response.url,
            createdBy: parsedUserId 
        }
    })

    fs.unlinkSync(localFilePath);

    res.status(200).send({
        status: "success",
        message: "Video uploaded successfully...",
        videoInfo: newPost
    })
}

export const getVideoHandle = async(req:Request, res:Response) => {

    // console.log(req.params)
    try {
        const videoId = req.params.videoId
        const parsedVideoId = parseInt(videoId)
        if(!videoId) {
            res.status(404).send({
                status: 'failure',
                message: "Bad Request"
            })
            return;
        }
        const videoInfo = await prisma.video.findUnique({
            where: {
                videoId: parsedVideoId
            },
            include : {
                _count: {
                    select:{
                        likes: true
                    }
                }
            }
        })
        console.log(videoInfo)
        if(!videoInfo){
            res.status(404).send({
                status: 'failure',
                message: "No such video exists"
            })
            return;
        }
        // console.log(videoInfo)
        res.status(200).send({
            status: "success",
            message: "Video fetched successfully...",
            "video Details": {
                title: videoInfo?.title,
                description: videoInfo?.description,
                url: videoInfo?.videoLink,
                createdBy: videoInfo?.createdBy,
                createdAt: videoInfo?.createdAt,
                likes : videoInfo?._count.likes
            } 
        })
    } catch (error) {
        console.log("Something went wrong while getting a video. \n", error);
        res.status(501).send({
            status: "failure",
            message: "Something went wrong!"
        })
    }
}

export const deleteHandle = async(req:Request, res:Response) => {

    try {
        const videoId = req.params.videoId;
        const parsedVideoId = parseInt(videoId)
        if(!videoId){
            res.status(404).send({
                status: "failure",
                message: "Bad Request",
            })
            return;
        }
        const userId = await getPayload(req.cookies.token) || "";
        const parsedUserId = parseInt(userId)
        const deletedVideo = await prisma.video.delete({
            where: {
                videoId: parsedVideoId,
                createdBy: parsedUserId
            }
        })
        // console.log(deletedVideo)
        if(!deletedVideo){
            res.status(404).send({
                status: "failure",
                message: "No such video to delete"
            })
            return;
        }
        
        const videoURL = deletedVideo.videoLink;
        const videoPublicId = videoURL?.substring( videoURL.lastIndexOf('/')+1 , videoURL.lastIndexOf('.')) || "";
        // console.log(videoPublicId)
        const cloudDeleteStatus = await deleteFromCloudinary(videoPublicId.trim());
        console.log(cloudDeleteStatus)
        res.status(200).send({
            status: "success",
            message: "Video deleted successfully...",
            deletedVideo
        })
    } catch (error) {
        console.log("Something went wrong while deleting the video \n", error)
        res.status(500).send({
            status: "failure",
            message: "Something went wrong!"
        })
    }
}

export const likeHandle = async(req:Request, res:Response) => {

   try {
     const userId = await getPayload(req.cookies.token) || "";
     const parsedUserId = parseInt(userId)
     const videoId = req.params.videoId
     const parsedVideoId = parseInt(videoId)
 
     const alreadyLiked = await prisma.like.findFirst({
         where: {
             videoId: parsedVideoId,
             creatorId: parsedUserId
         }
     })
 
     if(alreadyLiked) {
         
         const deleteLike = await prisma.like.delete({
             where: {
                 likeId: alreadyLiked.likeId
             }
         })
 
         res.status(200).send({
             status: "success",
             message: "Like removed successfully...",
             deleteLike
         })
         return;
     }
     else {
         
         const likeInfo = await prisma.like.create({
             data: {
                 videoId: parsedVideoId,
                 creatorId: parsedUserId
             }
         })
         res.status(200).send({
             status: "success",
             message: "Liked the video successfully..",
             likeInfo
         })
         return
     }
   } catch (error) {
        console.log("Something went wrong while liking..\n", error)
        res.status(500).send({
            status: "failure",
            message: "Something went wrong!"
        })
   }
}