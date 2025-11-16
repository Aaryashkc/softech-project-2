import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema({
  hero: {
    value: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    profileImage: { type: String, required: false, default: "" },
    buttons: [
      {
        text: { type: String, required: true },
        link: { type: String, required: true },
        type: { type: String, enum: ["primary", "secondary"], required: true },
      },
    ],
  },

  highlights: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    items: [
      {
        icon: { type: String, required: true }, 
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },

  initiatives: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    items: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        date: { type: String, required: true },
        imageAlt: { type: String },
      },
    ],
  },

  cta: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
  },
});

const Home = mongoose.model("Home", HomeSchema);

export default Home;