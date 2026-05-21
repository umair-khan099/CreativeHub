import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videoUrl: {
      type: String, //cloudinary
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String, // cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    duration: {
      type: Number, // cloudinary
      required: true,
      min: 0,
    },
    views: {
      type: Number, // cloudinary
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = model("Video", videoSchema);
