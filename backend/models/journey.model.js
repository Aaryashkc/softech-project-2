import mongoose from "mongoose";

const JourneySchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },

  milestones: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    items: [
      {
        year: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
  },

  leadershipPhases: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    phases: [
      {
        title: { type: String, required: true },
        period: { type: String, required: true },
        periodColor: { type: String, required: true },
        icon: { type: String, required: true },
        iconColor: { type: String, required: true },
        dotColor: { type: String, required: true },
        items: [{ type: String }],
      },
    ],
  },

  interviewInsights: {
    sectionTitle: { type: String, required: true },
    sectionSubtitle: { type: String, required: true },
    items: [
      {
        source: { type: String, required: true },
        quote: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        iconColor: { type: String, required: true },
        bgColor: { type: String, required: true },
      },
    ],
  },

  currentFocus: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
  },
}, { timestamps: true });

const Journey = mongoose.model("Journey", JourneySchema);

export default Journey;
