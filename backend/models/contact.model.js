import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },

  contactInfo: {
    sectionTitle: { type: String },
    items: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
  },

  additionalInfo: {
    publicEngagement: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      items: [{ type: String }],
      icon: { type: String, required: true },
    },
    responseTime: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, required: true },
      times: [
        {
          label: { type: String, required: true },
          duration: { type: String, required: true },
        },
      ],
    },
    scheduleMeeting: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      note: { type: String, required: true },
      icon: { type: String, required: true },
    },
  },
}, { timestamps: true });

const Contact = mongoose.model("Contact", ContactSchema);

export default Contact;

