import mongoose, { Document, Schema } from "mongoose";

/* 
   NotificationsSchema will correspond to a collection in your MongoDB database. 
   It defines the structure and data types for the Notifications collection.
*/

// Interface representing a single document in the Notifications collection
interface INotification extends Document {
  opened: boolean;
  title: string;
  orderId: string;
  cover?: {
    _id: string;
    url: string;
    blurDataUrl: string;
  };
  city: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationsSchema: Schema<INotification> = new mongoose.Schema(
  {
    opened: {
      type: Boolean,
      required: [true, "Open is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    orderId: {
      type: String,
      required: [true, "Order Id is required."],
    },
    cover: {
      type: String,
    },
    city: {
      type: String,
      required: [true, "City is required."],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment Method is required."],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the Notifications model based on the NotificationsSchema
export default (mongoose.models
  .Notifications as mongoose.Model<INotification>) ||
  mongoose.model<INotification>("Notifications", NotificationsSchema);
