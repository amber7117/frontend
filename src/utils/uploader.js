import { uploadToR2, deleteFromR2 } from "./r2-uploader.js";

export const multiFileUploader = async (images) => {
  const uploadPromises = images.map(async (file) => {
    const result = await uploadToR2(file);
    return {
      _id: result.key,
      url: result.url,
    };
  });

  return Promise.all(uploadPromises);
};

export const singleFileUploader = async (file) => {
  const result = await uploadToR2(file);
  return {
    _id: result.key,
    url: result.url,
  };
};

export const singleFileDelete = async (fileKey) => {
  const result = await deleteFromR2(fileKey);
  return result;
};

export const multiFilesDelete = async (files) => {
  const deletePromises = files.map(async (file) => {
    const key = typeof file === 'string' ? file : file._id;
    return await deleteFromR2(key);
  });

  return Promise.all(deletePromises);
};
