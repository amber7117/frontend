import mongoose from "mongoose";

// Define the schema for the Blog
const BlogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "Heading is required"],
    },
    subHeading: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogCategory",
      },
    ],
    tags: {
      type: Array,
      required: [true, "Tags are required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    cover: {
      imageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Cover image ID is required"],
      },
      url: {
        type: String,
        required: [true, "Cover image URL is required"],
      },
    },
    content: [
      {
        heading: {
          type: String,
          required: [true, "Content heading is required"],
        },
        description: {
          type: String,
          required: [true, "Content description is required"],
        },
        cover: {
          imageId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Content cover image ID is required"],
          },
          url: {
            type: String,
            required: [true, "Content cover image URL is required"],
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
