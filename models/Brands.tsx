import mongoose, { Document, Schema, Model } from "mongoose";

export interface IBrand extends Document {
  logo?: {
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
}

const BrandSchema: Schema<IBrand> = new mongoose.Schema(
  {
    logo: {
      _id: {
        type: String,
        required: [true, "image-id-required-error"],
      },
      url: {
        type: String,
        required: [true, "image-url-required-error"],
      },
      blurDataUrl: {
        type: String,
        required: [true, "image-blur-data-url-required-error"],
      },
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    metaTitle: {
      type: String,
      required: [true, "Meta title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    metaDescription: {
      type: String,
      required: [true, "Meta description is required."],
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
    },
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: {
        values: ["active", "inactive"],
        message: "Invalid status value.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema);

export default Brand;
