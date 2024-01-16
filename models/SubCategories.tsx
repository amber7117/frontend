import mongoose, { Document, Schema } from "mongoose";

/* Define the interface for the SubCategory document */
export interface ISubCategory extends Document {
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
  parentCategory: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/* SubCategorySchema will correspond to a collection in your MongoDB database. */
const SubCategorySchema: Schema<ISubCategory> = new mongoose.Schema(
  {
    cover: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },
    metaTitle: {
      type: String,
      required: [true, "Meta Title is required."],
      maxlength: [100, "Meta Title cannot exceed 100 characters."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
    metaDescription: {
      type: String,
      required: [true, "Meta Description is required."],
      maxlength: [200, "Meta Description cannot exceed 200 characters."],
    },
    slug: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SubCategory ||
  mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
