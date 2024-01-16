import mongoose from "mongoose";
/* PetSchema will correspond to a collection in your MongoDB database. */

const BlogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    cover: {
      imageId: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BlogCategory ||
  mongoose.model("BlogCategory", BlogCategorySchema);
