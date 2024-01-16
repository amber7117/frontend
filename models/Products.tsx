import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for the Variant sub-document
interface IVariant extends Document {
  variantName: string;
  sku: string;
  price: number;
  priceSale: number;
  available: number;
  sold?: number;
  images?: {
    url: string;
    _id: string;
  };
  color?: string;
  size?: string;
}

// Interface for the Product document
interface IProduct extends Document {
  cover?: {
    _id: string;
    url: string;
    blurDataUrl: string;
  };
  blurDataUrl: string;
  name: string;
  code: string;
  status: string;
  isFeatured?: boolean;
  brand?: mongoose.Types.ObjectId;
  likes?: number;
  description?: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  category?: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  gender?: string;
  tags?: string[];
  selectedVariant: number;
  variants: IVariant[];
  reviews: mongoose.Types.ObjectId[];
}

// Define the schema for the Variant sub-document
const VariantSchema: Schema<IVariant> = new Schema<IVariant>({
  variantName: {
    type: String,
    required: [true, "Variant Name is required."],
  },
  sku: {
    type: String,
    required: [true, "SKU is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  priceSale: {
    type: Number,
    required: [true, "Sale price is required."],
  },
  available: {
    type: Number,
    required: [true, "Available quantity is required."],
  },
  sold: {
    type: Number,
    default: 0,
  },
  images: [
    {
      url: {
        type: String,
        required: [true],
      },
      _id: {
        type: String,
        required: [true],
      },
    },
  ],
  color: {
    type: String,
  },
  size: {
    type: String,
  },
});

// Define the schema for the Product document
const ProductSchema: Schema<IProduct> = new mongoose.Schema(
  {
    cover: {
      type: String,
      required: [true, "Cover image is required."],
    },
    blurDataUrl: {
      type: String,
      required: [true, "Blur data URL is required."],
    },
    name: {
      type: String,
      required: [true, "Product name is required."],
    },
    code: {
      type: String,
      required: [true, "Product code is required."],
    },
    status: {
      type: String,
      required: [true, "Product status is required."],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    likes: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    metaTitle: {
      type: String,
      required: [true, "Meta title is required."],
    },
    metaDescription: {
      type: String,
      required: [true, "Meta description is required."],
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
    },
    gender: {
      type: String,
    },
    tags: {
      type: [String],
    },
    selectedVariant: {
      type: Number,
      required: [true, "Selected variant is required."],
    },
    variants: {
      type: [VariantSchema],
      required: [true, "Variants are required."],
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create the Product model using the schema
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
