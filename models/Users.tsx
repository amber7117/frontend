import mongoose, { Document } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
interface User extends Document {
  firstName: string;
  lastName: string;
  fullName: string;
  cover?: {
    _id: string;
    url: string;
    blurDataUrl: string;
  };
  gender: string;
  phone: string;
  email: string;
  addresses: mongoose.Types.ObjectId[];
  password: string;
  status: string;
  about: string;
  joined: Date;
}

const UserSchema = new mongoose.Schema<User>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a First name."],
      maxlength: [20, "First Name cannot be more than 20 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a Last name."],
      maxlength: [20, "Last Name cannot be more than 20 characters."],
    },
    fullName: {
      type: String,
    },
    cover: {
      _id: { type: String },
      url: { type: String },
      blurDataUrl: {
        type: String,
      },
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Please provide a Phone Number."],
      maxlength: [20, "Phone cannot be more than 20 characters."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required."],
    },
    addresses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
    password: {
      type: String,
      select: false,
      required: [true, "Please enter a password."],
    },
    status: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);
