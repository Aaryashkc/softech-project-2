import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Contact from '../models/contact.model.js';
import connectDB from '../lib/mongodb.js';

const seedContactData = async (force = false) => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingData = await Contact.findOne();
    
    if (existingData && !force) {
      console.log('⚠️  Contact data already exists. Use --force to overwrite.');
      process.exit(0);
    }

    if (existingData && force) {
      await Contact.deleteOne();
      console.log('🗑️  Deleted existing contact data');
    }

    // Seed data
    const contactData = {
      hero: {
        title: "Get in Touch",
        subtitle: "Connect with us to discuss Nepal's future, share your concerns, or get involved in our initiatives"
      },

      contactInfo: {
        sectionTitle: "",
        items: [
          {
            title: "Office Location",
            description: "CPN (Maoist Centre)\nCentral Committee Office\nKathmandu, Nepal",
            icon: "MapPin"
          },
          {
            title: "Phone & Email",
            description: "Email: ranjitlama2039@gmail.com",
            icon: "Phone"
          },
          {
            title: "Office Hours",
            description: "Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed",
            icon: "Clock"
          }
        ]
      },

      additionalInfo: {
        publicEngagement: {
          title: "Public Engagement",
          description: "We believe in open dialogue and community engagement. Your voice matters in shaping Nepal's political future.",
          items: [
            "Regular community meetings and forums",
            "Town halls for policy discussions",
            "Youth engagement sessions",
            "Grassroots consultation programs"
          ],
          icon: "Users"
        },
        responseTime: {
          title: "Response Time",
          description: "We strive to respond to all inquiries promptly and thoroughly.",
          icon: "MessageSquare",
          times: [
            {
              label: "General Inquiries",
              duration: "24-48 hours"
            },
            {
              label: "Meeting Requests",
              duration: "3-5 business days"
            },
            {
              label: "Media Inquiries",
              duration: "Same day"
            },
            {
              label: "Urgent Matters",
              duration: "Within 4 hours"
            }
          ]
        },
        scheduleMeeting: {
          title: "Schedule a Meeting",
          description: "For in-person meetings, interviews, or formal consultations, please specify your preferred dates and the nature of the discussion.",
          note: "Due to high demand, meeting requests are prioritized based on urgency and alignment with current political initiatives and community needs.",
          icon: "Calendar"
        }
      }
    };

    const contact = new Contact(contactData);
    await contact.save();
    console.log('✅ Contact page data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding contact data:', error);
    process.exit(1);
  }
};

// Check for --force flag
const force = process.argv.includes('--force');
seedContactData(force);

