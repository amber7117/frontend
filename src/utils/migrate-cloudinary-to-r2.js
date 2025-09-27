import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "./r2.js";
import axios from "axios";

/**
 * Utility to migrate images from Cloudinary to Cloudflare R2
 * This script can be run once to migrate existing images
 */

/**
 * Download an image from Cloudinary URL
 * @param {string} cloudinaryUrl - The Cloudinary image URL
 * @returns {Promise<Buffer>} Image buffer
 */
const downloadFromCloudinary = async (cloudinaryUrl) => {
  try {
    const response = await axios.get(cloudinaryUrl, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading image from ${cloudinaryUrl}:`, error);
    throw error;
  }
};

/**
 * Upload image buffer to R2
 * @param {Buffer} imageBuffer - The image buffer
 * @param {string} fileName - File name for R2
 * @returns {Promise<Object>} Upload result
 */
const uploadToR2 = async (imageBuffer, fileName) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: imageBuffer,
      ContentType: 'image/jpeg', // Adjust based on actual image type
    });

    await r2Client.send(command);
    
    return {
      key: fileName,
      url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
    };
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
};

/**
 * Migrate a single image from Cloudinary to R2
 * @param {string} cloudinaryUrl - Cloudinary image URL
 * @param {string} targetFileName - Target file name in R2
 * @returns {Promise<Object>} Migration result
 */
export const migrateSingleImage = async (cloudinaryUrl, targetFileName) => {
  try {
    console.log(`Migrating image: ${cloudinaryUrl}`);
    
    // Download from Cloudinary
    const imageBuffer = await downloadFromCloudinary(cloudinaryUrl);
    
    // Upload to R2
    const result = await uploadToR2(imageBuffer, targetFileName);
    
    console.log(`Successfully migrated to: ${result.url}`);
    return result;
  } catch (error) {
    console.error(`Failed to migrate image: ${cloudinaryUrl}`, error);
    throw error;
  }
};

/**
 * Migrate multiple images from Cloudinary to R2
 * @param {Array} imageMappings - Array of { cloudinaryUrl, targetFileName } objects
 * @returns {Promise<Array>} Array of migration results
 */
export const migrateMultipleImages = async (imageMappings) => {
  const migrationPromises = imageMappings.map(async (mapping) => {
    return await migrateSingleImage(mapping.cloudinaryUrl, mapping.targetFileName);
  });

  return Promise.all(migrationPromises);
};

/**
 * Extract public ID from Cloudinary URL for migration
 * @param {string} cloudinaryUrl - Cloudinary image URL
 * @returns {string} Public ID
 */
export const extractPublicIdFromUrl = (cloudinaryUrl) => {
  // Example URL: https://res.cloudinary.com/techgater/image/upload/v1677779585/my-uploads/wehodsbrpbopwhizash2.jpg
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
  return match ? match[1] : null;
};

// Example usage:
// const imageMappings = [
//   {
//     cloudinaryUrl: "https://res.cloudinary.com/techgater/image/upload/v1677779585/my-uploads/image1.jpg",
//     targetFileName: "migrated/image1.jpg"
//   },
//   {
//     cloudinaryUrl: "https://res.cloudinary.com/techgater/image/upload/v1677779585/my-uploads/image2.jpg",
//     targetFileName: "migrated/image2.jpg"
//   }
// ];
// 
// migrateMultipleImages(imageMappings)
//   .then(results => console.log('Migration completed:', results))
//   .catch(error => console.error('Migration failed:', error));
