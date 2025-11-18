import mongoose from "mongoose";

const popupSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    message: { type: String, default: "" },
    image: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Popup = mongoose.model("Popup", popupSchema);
export default Popup
