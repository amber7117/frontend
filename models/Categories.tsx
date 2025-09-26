import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISubCategory extends Document {
  _id: mongoose.Types.ObjectId;
}

export interface ICategory extends Document {
  cover?: {
    _id: string;
    url: string;
    blurDataUrl: string;
  };
  name: string;
  metaTitle: string;
  description: string;
  metaDescription: string;
  slug: string;
  status: string;
  subCategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    cover: {
      _id: { type: String, required: [true, "image-id-required-error"] },
      url: { type: String, required: [true, "image-url-required-error"] },
      blurDataUrl: {
        type: String,
        required: [true, "image-blur-data-url-required-error"],
      },
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },
    metaTitle: {
      type: String,
      required: [true, "Meta title is required."],
      maxlength: [100, "Meta title cannot exceed 100 characters."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
    metaDescription: {
      type: String,
      required: [true, "Meta description is required."],
      maxlength: [200, "Meta description cannot exceed 200 characters."],
    },
    slug: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
