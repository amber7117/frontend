import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Wishlist item
interface WishlistItem {
  _id: mongoose.Types.ObjectId;
}

// Interface for Wishlist document
interface WishlistDocument extends Document {
  uid: string;
  wishlist: WishlistItem[];
}

// Interface for Wishlist model
interface WishlistModel extends Model<WishlistDocument> {}

// Define the Wishlist schema
const WishlistSchema: Schema<WishlistDocument> = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to validate required fields
WishlistSchema.pre<WishlistDocument>("save", function (next) {
  if (!this.uid) {
    const error = new Error("The 'uid' field is required.");
    next(error);
  } else if (this.wishlist.length === 0) {
    const error = new Error("The 'wishlist' field is required.");
    next(error);
  } else {
    next();
  }
});

// Define the Wishlist model
const Wishlist: WishlistModel =
  mongoose.models.Wishlist ||
  mongoose.model<WishlistDocument, WishlistModel>("Wishlist", WishlistSchema);

export default Wishlist;
