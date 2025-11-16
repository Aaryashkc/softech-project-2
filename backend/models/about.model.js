import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },

  biography: {
    title: { type: String, required: true },
    image: { type: String, required: false },
    paragraphs: [{ type: String }],
  },

  coreValues: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    items: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
  },

  vision: {
    title: { type: String, required: true },
    quote: { type: String, required: true },
    author: { type: String, required: true },
  },

  philosophy: {
    title: { type: String, required: true },
    paragraphs: [{ type: String }],
    priorities: {
      title: { type: String, required: true },
      items: [{ type: String }],
    },
  },
}, { timestamps: true });

const About = mongoose.model("About", AboutSchema);

export default About;
