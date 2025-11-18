import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  category: {
  type: String,
  enum: ["normal", "साहित्य र संगित"],
  default: "normal"
 },

  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
