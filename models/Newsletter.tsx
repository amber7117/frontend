import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the Newsletter document
interface INewsletter extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Newsletter schema
const NewsletterSchema: Schema<INewsletter> = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "email-required-error"],
    },
  },
  { timestamps: true }
);

// Define the Newsletter model
const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export default Newsletter;
