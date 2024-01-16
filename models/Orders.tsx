import mongoose, { Document, Schema } from "mongoose";

/* 
   OrderSchema will correspond to a collection in your MongoDB database. 
   It defines the structure and data types for the Order collection.
*/

// Interface representing a single document in the Order collection
interface IOrder extends Document {
  paymentMethod: string;
  subTotal: string;
  total: string;
  shipping: number;
  discount?: number;
  basePrice: number;
  currency: string;
  status?: string;
  orderNo?: string;
  items?: any[];
  user: object;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      required: [true, "Payment Method is required."],
    },
    subTotal: {
      type: String,
      required: [true, "Subtotal is required."],
    },
    total: {
      type: String,
      required: [true, "Total is required."],
    },
    shipping: {
      type: Number,
      required: [true, "Shipping is required."],
    },
    discount: {
      type: Number,
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required."],
    },
    currency: {
      type: String,
      required: [true, "Currency is required."],
    },
    status: {
      type: String,
    },
    orderNo: {
      type: String,
    },
    items: {
      type: Array,
    },
    user: {
      type: Object,
      required: [true, "User is required."],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the Order model based on the OrderSchema
export default (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);
