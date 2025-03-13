import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async(localpath:string) => {

    try {  
        if(!localpath){
            return null;
        }
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: 'auto',
            folder: 'yt_backend_with_prisma'
        })
        console.log(response.public_id);
        
        return response;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localpath)
        return null;
    }
}

export const deleteFromCloudinary = async (publicId: string) => {
    try {
        if (!publicId) return null;
        const result = await cloudinary.uploader.destroy(publicId); 
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
}
