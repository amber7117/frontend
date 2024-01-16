import mongoose, { Schema, Document } from "mongoose";

/* UserNotificationSchema will correspond to a collection in your MongoDB database. */

interface IUserNotification extends Document {
  title?: string;
  description?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSchema: Schema<IUserNotification> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    link: {
      type: String,
      required: [true, "Link is required."],
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserNotification ||
  mongoose.model<IUserNotification>("UserNotification", UserNotificationSchema);
