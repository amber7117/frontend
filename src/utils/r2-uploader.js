import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Upload file to R2
export const uploadToR2 = async (file) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);
    
    // Return the public URL
    return {
      _id: fileName,
      url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
      public_id: fileName,
      secure_url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
    };
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

// Delete file from R2
export const deleteFromR2 = async (fileId) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileId,
    });

    await s3Client.send(command);
    return { result: 'ok' };
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw error;
  }
};

// Multiple file upload
export const multiFileUploader = async (files) => {
  const uploadPromises = files.map(file => uploadToR2(file));
  const results = await Promise.all(uploadPromises);
  
  return results.map(result => ({
    _id: result.public_id,
    url: result.secure_url,
  }));
};

// Single file upload
export const singleFileUploader = async (file) => {
  const result = await uploadToR2(file);
  return {
    _id: result.public_id,
    url: result.secure_url,
  };
};

// Single file delete
export const singleFileDelete = async (fileId) => {
  return await deleteFromR2(fileId);
};

// Multiple files delete
export const multiFilesDelete = async (files) => {
  const deletePromises = files.map(file => deleteFromR2(file._id));
  await Promise.all(deletePromises);
  return { result: 'ok' };
};
