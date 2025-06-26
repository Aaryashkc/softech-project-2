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

  images: {
    type: [String],
    required: true,
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: 'At least one image is required.'
    }
  }
}, {
  timestamps: true
});
const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery