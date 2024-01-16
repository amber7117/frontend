import mongoose, { Document, Schema } from "mongoose";

// Interface for the HomeBanners document
interface IHomeBanners extends Document {
  bannerAfterSlider1: {
    cover: {
      _id: string;
      url: string;
      blurDataUrl: string;
    };
    url?: string;
  };
  bannerAfterSlider2: {
    cover: {
      _id: string;
      url: string;
      blurDataUrl: string;
    };
    url?: string;
  };
  bannerAfterSlider3: {
    cover: {
      _id: string;
      url: string;
      blurDataUrl: string;
    };
    url?: string;
  };
  centeredBanner: {
    cover: {
      _id: string;
      url: string;
      blurDataUrl: string;
    };
    url?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the HomeBanners schema
const HomeBannersSchema: Schema<IHomeBanners> = new mongoose.Schema(
  {
    bannerAfterSlider1: {
      cover: {
        _id: { type: String, required: [true, "image-id-required-error"] },
        url: { type: String, required: [true, "image-url-required-error"] },
        blurDataUrl: {
          type: String,
          required: [true, "image-blur-data-url-required-error"],
        },
      },
      url: String,
    },
    bannerAfterSlider2: {
      cover: {
        _id: { type: String, required: [true, "image-id-required-error"] },
        url: { type: String, required: [true, "image-url-required-error"] },
        blurDataUrl: {
          type: String,
          required: [true, "image-blur-data-url-required-error"],
        },
      },
      url: String,
    },
    bannerAfterSlider3: {
      cover: {
        _id: { type: String, required: [true, "image-id-required-error"] },
        url: { type: String, required: [true, "image-url-required-error"] },
        blurDataUrl: {
          type: String,
          required: [true, "image-blur-data-url-required-error"],
        },
      },
      url: String,
    },
    centeredBanner: {
      cover: {
        _id: { type: String, required: [true, "image-id-required-error"] },
        url: { type: String, required: [true, "image-url-required-error"] },
        blurDataUrl: {
          type: String,
          required: [true, "image-blur-data-url-required-error"],
        },
      },
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

// Define and export the HomeBanners model
export default (mongoose.models.HomeBanners as mongoose.Model<IHomeBanners>) ||
  mongoose.model<IHomeBanners>("HomeBanners", HomeBannersSchema);
