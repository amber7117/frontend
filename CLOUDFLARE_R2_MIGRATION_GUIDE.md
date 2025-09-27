# Cloudflare R2 Migration Guide

## Overview
This guide outlines the migration from Cloudinary to Cloudflare R2 for image storage and management.

## Current Cloudinary Setup
- Cloudinary is used for image uploads, storage, and delivery
- Configuration in `src/utils/cloudinary.js`
- Upload utilities in `src/utils/uploader.js`
- Image URLs use `res.cloudinary.com` domain

## Cloudflare R2 Benefits
- **Cost-effective**: No egress fees
- **S3-compatible**: Uses AWS S3 SDK
- **Global CDN**: Built-in with Cloudflare
- **Simple migration**: Similar API patterns

## Migration Steps

### 1. Update Dependencies
Remove Cloudinary and add AWS S3 SDK (already present):
```json
"dependencies": {
  "@aws-sdk/client-s3": "^3.896.0",
  // Remove: "cloudinary": "^1.34.0"
}
```

### 2. Environment Configuration
Update `.env` file with R2 credentials (already configured):
```
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 3. Create R2 Configuration
Create `src/utils/r2.js` for R2 client configuration.

### 4. Update Upload Utilities
Replace Cloudinary functions in `src/utils/uploader.js` with R2 equivalents.

### 5. Update Image URLs
Update image URL patterns from Cloudinary to R2 format.

### 6. Update Next.js Configuration
Modify `next.config.js` to allow R2 image domains.

## Implementation Status
- ✅ Environment variables configured
- ✅ AWS S3 SDK already installed
- ✅ R2 client configuration created (`src/utils/r2.js`)
- ✅ R2 upload utilities created (`src/utils/r2-uploader.js`)
- ✅ Migration utilities created (`src/utils/migrate-cloudinary-to-r2.js`)
- ✅ Next.js config updated for R2 domains
- 🔄 Update existing code to use R2 instead of Cloudinary
- 🔄 Test the migration

## Usage Instructions

### For New Uploads
```javascript
import { singleFileUploader, multiFileUploader } from 'src/utils/r2-uploader';

// Upload single file
const result = await singleFileUploader(file);

// Upload multiple files
const results = await multiFileUploader(files);
```

### For Migration
```javascript
import { migrateMultipleImages } from 'src/utils/migrate-cloudinary-to-r2';

const imageMappings = [
  {
    cloudinaryUrl: "https://res.cloudinary.com/techgater/image/upload/v1677779585/my-uploads/image1.jpg",
    targetFileName: "migrated/image1.jpg"
  }
];

await migrateMultipleImages(imageMappings);
```

## Next Steps
1. Update existing components to use the new R2 uploader
2. Run migration script for existing images
3. Update database records with new R2 URLs
4. Remove Cloudinary configuration files
5. Test thoroughly
