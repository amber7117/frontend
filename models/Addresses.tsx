import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAddress extends Document {
  address: string;
  city: string;
  phone?: string;
  country: string;
  user: mongoose.Schema.Types.ObjectId;
  zip: number;
  state?: string;
  active?: boolean;
}

const AddressSchema: Schema<IAddress> = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Address is required"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required."],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    active: {
      type: Boolean,
      required: [true, "Defualt Address is required"],
    },
    zip: {
      type: Number,
      required: [true, "Defualt Address is required"],
    },
  },
  { timestamps: true }
);

const Address: Model<IAddress> =
  mongoose.models.Address || mongoose.model<IAddress>("Address", AddressSchema);

export default Address;
