# Cloudflare R2 Migration Guide

This guide explains how to migrate from Cloudinary to Cloudflare R2 for image storage and management in your e-commerce application.

## Overview

Cloudflare R2 is an object storage service that offers:
- **Zero egress fees** - No charges for data transfer out
- **Compatible with S3 API** - Easy migration from existing S3-compatible services
- **Global edge network** - Fast content delivery worldwide
- **Cost-effective** - Lower storage costs compared to Cloudinary

## Migration Steps

### 1. Set Up Cloudflare R2

#### Create R2 Bucket
1. Log in to your Cloudflare dashboard
2. Go to **R2** → **Create bucket**
3. Name your bucket (e.g., `ecommerce-images`)
4. Choose your preferred region

#### Get API Credentials
1. Go to **R2** → **Manage R2 API Tokens**
2. Create a new token with:
   - **Permissions**: Object Read & Write
   - **Bucket access**: Specific to your bucket

### 2. Update Environment Variables

Replace your Cloudinary environment variables with R2 credentials:

```env
# Remove Cloudinary variables
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_PUBLISHABLE_KEY=your_key
# CLOUDINARY_SECRET_KEY=your_secret

# Add R2 variables
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=ecommerce-images
R2_PUBLIC_URL=https://pub-<account-id>.r2.dev
```

### 3. Update Image Upload Utilities

#### Replace Cloudinary Upload Function

**Before (Cloudinary):**
```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_PUBLISHABLE_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadToCloudinary = async (file) => {
  return await cloudinary.uploader.upload(file, {
    folder: 'products',
  });
};
```

**After (R2):**
```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (file, fileName, folder = 'products') => {
  const key = `${folder}/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg', // Adjust based on file type
  });

  await s3Client.send(command);
  
  return {
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    key: key
  };
};
```

### 4. Update Image URLs in Database

#### Migration Script

Create a script to migrate existing Cloudinary URLs to R2:

```javascript
// scripts/migrate-images.js
import mongoose from 'mongoose';
import Product from '../models/Products';

const migrateImages = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const products = await Product.find({});
  
  for (const product of products) {
    // Update cover image
    if (product.cover && product.cover.includes('cloudinary')) {
      const newUrl = await migrateSingleImage(product.cover);
      product.cover = newUrl;
    }
    
    // Update variant images
    if (product.variants) {
      for (const variant of product.variants) {
        if (variant.images) {
          for (const image of variant.images) {
            if (image.url.includes('cloudinary')) {
              image.url = await migrateSingleImage(image.url);
            }
          }
        }
      }
    }
    
    await product.save();
    console.log(`Migrated product: ${product.name}`);
  }
  
  await mongoose.disconnect();
};

const migrateSingleImage = async (cloudinaryUrl) => {
  // Extract image public_id from Cloudinary URL
  const publicId = cloudinaryUrl.split('/').pop().split('.')[0];
  
  // Download from Cloudinary
  const response = await fetch(cloudinaryUrl);
  const imageBuffer = await response.arrayBuffer();
  
  // Upload to R2
  const r2Result = await uploadToR2(
    Buffer.from(imageBuffer),
    `${publicId}.jpg`,
    'migrated-products'
  );
  
  return r2Result.url;
};
```

### 5. Update Frontend Components

#### Product Image Components

Update components that display product images to use R2 URLs:

```tsx
// Before: Using Cloudinary transformation URLs
<img 
  src={`https://res.cloudinary.com/cloudname/image/upload/w_300,h_300/${product.cover}`}
  alt={product.name}
/>

// After: Using R2 URLs with Cloudflare Image Resizing
<img 
  src={`${process.env.R2_PUBLIC_URL}/products/${product.cover}?width=300&height=300&fit=cover`}
  alt={product.name}
/>
```

### 6. Implement Cloudflare Image Resizing

Cloudflare offers built-in image resizing. Update your image URLs to include resize parameters:

```javascript
// Utility function for resized image URLs
export const getResizedImageUrl = (imageUrl, width, height, fit = 'cover') => {
  if (imageUrl.includes('r2.dev')) {
    return `${imageUrl}?width=${width}&height=${height}&fit=${fit}`;
  }
  return imageUrl; // Fallback for non-R2 URLs
};
```

### 7. Update Admin Panel

#### Product Creation/Editing Forms

Update admin forms to use R2 upload instead of Cloudinary:

```tsx
// Replace Cloudinary upload widget with R2 upload
const handleImageUpload = async (file) => {
  try {
    const result = await uploadToR2(file, file.name, 'products');
    setImageUrl(result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 8. Performance Optimization

#### Implement CDN Caching

Configure Cloudflare CDN caching for better performance:

```javascript
// Add cache headers when uploading
const uploadToR2WithCache = async (file, fileName, folder = 'products') => {
  const key = `${folder}/${Date.now()}-${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000', // 1 year cache
  });

  await s3Client.send(command);
  
  return {
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    key: key
  };
};
```

### 9. Cost Comparison

| Feature | Cloudinary | Cloudflare R2 |
|---------|------------|---------------|
| Storage | $0.10/GB | $0.015/GB |
| Transformations | $0.005/image | Free (built-in) |
| Bandwidth | $0.08-0.12/GB | $0.00 (free egress) |
| API Requests | $0.005/1000 | $0.36/million |

### 10. Testing Strategy

#### Before Going Live

1. **Test upload functionality** with sample images
2. **Verify image display** across different devices
3. **Test CDN performance** with various image sizes
4. **Validate database migration** with a subset of products
5. **Monitor error rates** during migration

#### Rollback Plan

Keep Cloudinary configuration as backup during migration:

```javascript
const uploadImage = async (file) => {
  try {
    // Try R2 first
    return await uploadToR2(file);
  } catch (error) {
    console.warn('R2 upload failed, falling back to Cloudinary');
    return await uploadToCloudinary(file);
  }
};
```

## Benefits of Migration

1. **Cost Savings**: Significant reduction in storage and bandwidth costs
2. **Performance**: Global edge network for faster delivery
3. **Simplicity**: Single provider for storage and CDN
4. **Scalability**: Built-in scaling with Cloudflare's infrastructure

## Monitoring and Maintenance

After migration, monitor:
- Storage usage and costs
- Image loading performance
- Error rates for upload/download operations
- CDN cache hit ratios

## Virtual Product System Integration

The virtual product system has been implemented alongside this migration. Key features:

### Virtual Product Model Updates
- Added `isVirtual` flag to products
- Virtual code generation and management
- Status tracking (pending, active, used, expired)

### Order System Integration
- Virtual codes stored with orders
- User interface for code retrieval
- Status management for virtual products

### Admin Features
- Mark products as virtual during creation
- Generate and manage virtual codes
- Track code usage and expiration

This migration provides a complete solution for both physical and virtual product management with optimized image storage using Cloudflare R2.
