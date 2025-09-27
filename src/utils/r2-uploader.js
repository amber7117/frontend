import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2.js";
import { v4 as uuidv4 } from "uuid";

/**
 * @typedef {Object} UploadResult
 * @property {string} _id - File key (for compatibility)
 * @property {string} key - File key
 * @property {string} url - Public URL of the uploaded file
 */

/**
 * Upload a file to Cloudflare R2
 * @param {File|Buffer} file - The file to upload
 * @param {string} fileName - Optional custom file name
 * @returns {Promise<UploadResult>} Upload result with URL and key
 */
export const uploadToR2 = async (file, fileName = null) => {
  try {
    const fileKey = fileName || `${uuidv4()}-${file.name || "file"}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    });

    await r2Client.send(command);
    
    return {
      _id: fileKey, // Add _id for compatibility
      key: fileKey,
      url: `${process.env.R2_PUBLIC_URL}/${fileKey}`,
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
};

/**
 * Delete a file from Cloudflare R2
 * @param {string} fileKey - The file key to delete
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromR2 = async (fileKey) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
    });

    const result = await r2Client.send(command);
    return result;
  } catch (error) {
    console.error("Error deleting from R2:", error);
    throw error;
  }
};

/**
 * Upload multiple files to R2
 * @param {Array} files - Array of files to upload
 * @returns {Promise<Array>} Array of upload results
 */
export const multiFileUploader = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const result = await uploadToR2(file);
    return {
      _id: result.key, // Maintain compatibility with existing code
      key: result.key, // New property for clarity
      url: result.url,
    };
  });

  return Promise.all(uploadPromises);
};

/**
 * Upload a single file to R2
 * @param {File|Buffer} file - The file to upload
 * @returns {Promise<Object>} Upload result
 */
export const singleFileUploader = async (file) => {
  const result = await uploadToR2(file);
  return {
    _id: result.key, // Maintain compatibility with existing code
    key: result.key, // New property for clarity
    url: result.url,
  };
};

/**
 * Delete a single file from R2
 * @param {string} fileKey - The file key to delete
 * @returns {Promise<Object>} Delete result
 */
export const singleFileDelete = async (fileKey) => {
  return await deleteFromR2(fileKey);
};

/**
 * Delete multiple files from R2
 * @param {Array} fileKeys - Array of file keys to delete
 * @returns {Promise<Array>} Array of delete results
 */
export const multiFilesDelete = async (fileKeys) => {
  const deletePromises = fileKeys.map(async (fileKey) => {
    return await deleteFromR2(fileKey._id || fileKey);
  });

  return Promise.all(deletePromises);
};
