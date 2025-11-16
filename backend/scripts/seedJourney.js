import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Journey from '../models/journey.model.js';
import connectDB from '../lib/mongodb.js';

const seedJourneyData = async (force = false) => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingData = await Journey.findOne();
    
    if (existingData && !force) {
      console.log('⚠️  Journey data already exists. Use --force to overwrite.');
      process.exit(0);
    }

    if (existingData && force) {
      await Journey.deleteOne();
      console.log('🗑️  Deleted existing journey data');
    }

    // Seed data
    const journeyData = {
      hero: {
        title: "Political Journey",
        subtitle: "From student activism to national leadership - a chronicle of dedication to Nepal's progress"
      },

      milestones: {
        sectionTitle: "Career Milestones",
        sectionSubtitle: "Key moments that shaped a journey of public service and political leadership",
        items: [
          {
            year: "2017",
            title: "ANNISU (R) Chairman",
            description: "Elected as the first democratically chosen Chairman of ANNISU (R), the student wing of CPN (Maoist Centre), at the 21st national conference in Kathmandu.",
            icon: "Users",
            color: "bg-blue-500"
          },
          {
            year: "2021",
            title: "Central Committee Member",
            description: "Promoted to the Central Committee of CPN (Maoist Centre) as part of the youth inclusion initiative, representing the under-40 demographic in party leadership.",
            icon: "Award",
            color: "bg-green-500"
          },
          {
            year: "2025",
            title: "Tarai-Madhes Campaign Leader",
            description: "Appointed as Jhapa in-charge for the comprehensive 'Tarai-Madhes Awareness Campaign', coordinating grassroots mobilization efforts across the region.",
            icon: "MapPin",
            color: "bg-red-600"
          }
        ]
      },

      leadershipPhases: {
        sectionTitle: "Leadership Evolution",
        sectionSubtitle: "Three distinct phases of growth and increasing responsibility",
        phases: [
          {
            title: "Student Leader",
            period: "2017 - 2021",
            periodColor: "text-blue-600",
            icon: "Users",
            iconColor: "bg-blue-100",
            dotColor: "bg-blue-500",
            items: [
              "First democratically elected ANNISU (R) Chairman",
              "Advocate for free education and healthcare",
              "Vocal opponent of education privatization",
              "Promoted merit-based university leadership"
            ]
          },
          {
            title: "Party Leadership",
            period: "2021 - Present",
            periodColor: "text-green-600",
            icon: "Award",
            iconColor: "bg-green-100",
            dotColor: "bg-green-500",
            items: [
              "Central Committee member, CPN (Maoist Centre)",
              "Part of historic youth inclusion initiative",
              "Representative of under-40 demographic",
              "Influence in national policy decisions"
            ]
          },
          {
            title: "Grassroots Organizer",
            period: "2025 - Ongoing",
            periodColor: "text-red-600",
            icon: "MapPin",
            iconColor: "bg-red-100",
            dotColor: "bg-red-500",
            items: [
              "Jhapa in-charge for regional campaigns",
              "Strategic grassroots mobilization",
              "Community engagement and outreach",
              "Democratic participation advocacy"
            ]
          }
        ]
      },

      interviewInsights: {
        sectionTitle: "Political Philosophy in Action",
        sectionSubtitle: "Insights from key interviews and public statements",
        items: [
          {
            source: "2021 Interview - The Annapurna Express",
            quote: "Student wings must serve as watchdogs over government actions, especially during political crises like the dissolution of Parliament.",
            description: "This interview highlighted his belief in the crucial role of student organizations in maintaining democratic accountability and oversight.",
            icon: "Calendar",
            iconColor: "text-red-600",
            bgColor: "bg-red-50"
          },
          {
            source: "2021 - Central Committee Appointment",
            quote: "The 20% under-40 quota represents a historic commitment to youth inclusion in Nepal's political future.",
            description: "His appointment to the Central Committee alongside 11 other young leaders marked a significant shift toward youth representation in national politics.",
            icon: "Users",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50"
          }
        ]
      },

      currentFocus: {
        title: "Current Focus & Future Goals",
        description: "Continuing the mission of grassroots engagement while maintaining influence in national policy-making. The focus remains on strengthening democratic institutions, promoting youth participation, and ensuring that the voice of ordinary citizens is heard in the corridors of power.",
        tags: [
          "#YouthLeadership",
          "#GrassrootsEngagement",
          "#SocialJustice",
          "#DemocraticReform"
        ]
      }
    };

    // Create journey document
    const journey = new Journey(journeyData);
    await journey.save();

    console.log('✅ Journey data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding journey data:', error);
    process.exit(1);
  }
};

// Check for --force flag
const force = process.argv.includes('--force');

seedJourneyData(force);

