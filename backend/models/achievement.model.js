import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },

  stats: [
    {
      number: { type: String, required: true },
      label: { type: String, required: true },
      icon: { type: String, required: true }, 
      details: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        highlights: [{ type: String }],
      },
    },
  ],

  achievements: [
    {
      category: { type: String, required: true },
      icon: { type: String, required: true },
      color: { type: String },
      items: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          impact: { type: String, required: true },
        },
      ],
    },
  ],

  mediaRecognition: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    items: [
      {
        outlet: { type: String, required: true },
        outletColor: { type: String },
        title: { type: String, required: true },
        description: { type: String, required: true },
        year: { type: String, required: true },
        link: { type: String },
      },
    ],
  },

  futureGoals: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    immediate: {
      title: { type: String },
      items: [{ type: String }],
    },
    longTerm: {
      title: { type: String },
      items: [{ type: String }],
    },
  },
});

export default mongoose.model("Achievement", AchievementSchema);
