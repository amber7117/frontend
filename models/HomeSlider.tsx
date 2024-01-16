import mongoose, { Document, Model } from "mongoose";

/* HomeSliderSchema will correspond to a collection in your MongoDB database. */

export interface IHomeSlider extends Document {
  cover?: {
    _id: string;
    url: string;
    blurDataUrl: string;
  };
  heading: string;
  description: string;
  enabled: boolean;
  btnPrimary: {
    btnText: string;
    url: string;
  };
  btnSecondary: {
    btnText: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HomeSliderSchema = new mongoose.Schema<IHomeSlider>(
  {
    cover: {
      _id: {
        type: String,
        required: [true, "Image ID is required."],
      },
      url: {
        type: String,
        required: [true, "Image URL is required."],
      },
      blurDataUrl: {
        type: String,
        required: [true, "Image blur data URL is required."],
      },
    },
    heading: {
      type: String,
      required: [true, "Heading is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    enabled: {
      type: Boolean,
      required: [true, "Enabled status is required."],
    },
    btnPrimary: {
      btnText: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    btnSecondary: {
      btnText: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const HomeSlider: Model<IHomeSlider> =
  mongoose.models.HomeSlider ||
  mongoose.model<IHomeSlider>("HomeSlider", HomeSliderSchema);

export default HomeSlider;
