import path from 'path'
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import { Readable } from 'stream';

dotenv.config({path:path.resolve('./config/.env')})

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


// ✅ Unified function for both buffer (memoryStorage) and file path (diskStorage)
export const uploadImageToCloudinary = async (file, folder = '', publicId = '') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      public_id: publicId || undefined,
      resource_type: 'image',
    };

    if (file.buffer) {
      // Multer memoryStorage
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      const readable = new Readable();
      readable._read = () => {};
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(stream);
    } else if (file.path) {
      // Multer diskStorage (if ever used)
      cloudinary.uploader.upload(file.path, uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    } else {
      reject(new Error('Invalid file input: missing buffer or path'));
    }
  });
};

export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract the path after /upload/ and before the file extension
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp)/);

    if (!matches || !matches[1]) {
      throw new Error('Failed to extract publicId from imageUrl');
    }

    // Decode to remove %28 and %29 (which represent "(" and ")")
    const publicId = decodeURIComponent(matches[1]);


    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  } catch (err) {
    throw new Error('Failed to extract publicId from imageUrl');
  }
};

export default cloudinary;