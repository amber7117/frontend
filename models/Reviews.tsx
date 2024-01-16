import mongoose, { Schema, Document } from "mongoose";

/* ReviewSchema will correspond to a collection in your MongoDB database. */

interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  review: string;
  rating: number;
  isPurchased: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required."],
    },
    review: {
      type: String,
      required: [true, "Review is required."],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required."],
    },
    isPurchased: {
      type: Boolean,
      required: [true, "isPurchased is required."],
    },
    images: {
      type: [String],
      required: [true, "Images are required."],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
