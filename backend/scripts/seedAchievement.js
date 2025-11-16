import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Achievement from '../models/achievement.model.js';
import connectDB from '../lib/mongodb.js';

const seedAchievementData = async (force = false) => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingData = await Achievement.findOne();
    
    if (existingData && !force) {
      console.log('⚠️  Achievement data already exists. Use --force to overwrite.');
      process.exit(0);
    }

    if (existingData && force) {
      await Achievement.deleteOne();
      console.log('🗑️  Deleted existing achievement data');
    }

    // Seed data
    const achievementData = {
      hero: {
        title: "Achievements & Impact",
        subtitle: "A record of transformative leadership and meaningful contributions to Nepal's political landscape"
      },

      stats: [
        {
          number: "2017",
          label: "First Democratic Election Win",
          icon: "Trophy",
          details: {
            title: "Historic ANNISU (R) Election Victory",
            description: "Made history by becoming the first democratically elected Chairman of ANNISU (R) at the 21st national conference in Kathmandu. This milestone marked a significant shift towards transparent and merit-based leadership selection in student organizations.",
            highlights: [
              "First democratic election in organization's history",
              "Won with overwhelming support from student delegates",
              "Set new precedent for transparent leadership selection",
              "Inspired democratic reforms in other student bodies"
            ]
          }
        },
        {
          number: "2021",
          label: "Central Committee Appointment",
          icon: "Target",
          details: {
            title: "CPN (Maoist Centre) Central Committee",
            description: "Appointed to the Central Committee of CPN (Maoist Centre) in December 2021 as part of a historic youth inclusion initiative. This appointment represented a major step forward in ensuring young voices have a seat at the highest levels of political decision-making.",
            highlights: [
              "Part of groundbreaking 20% under-40 quota implementation",
              "Youngest cohort in Central Committee history",
              "Direct participation in national policy formulation",
              "Bridge between youth concerns and party leadership"
            ]
          }
        },
        {
          number: "12",
          label: "Young Leaders in Initiative",
          icon: "Users",
          details: {
            title: "Youth Inclusion Pioneer Group",
            description: "One of 12 young leaders selected for the historic youth quota implementation in the party's Central Committee. This initiative fundamentally changed the age dynamics of Nepal's political leadership and created a framework for sustained youth participation.",
            highlights: [
              "Pioneered youth representation at national level",
              "Established framework for future youth inclusion",
              "Collective voice for under-40 demographic",
              "Model adopted by other political organizations"
            ]
          }
        },
        {
          number: "2025",
          label: "Major Campaign Leadership",
          icon: "Vote",
          details: {
            title: "Tarai-Madhes Awareness Campaign",
            description: "Appointed as Jhapa in-charge for the comprehensive 'Tarai-Madhes Awareness Campaign' in February 2025. Led extensive grassroots mobilization efforts coordinating activities from Jhapa to Kanchanpur, demonstrating exceptional organizational and strategic capabilities.",
            highlights: [
              "Coordinated multi-district campaign operations",
              "Strengthened party-community connections",
              "Enhanced democratic participation in rural areas",
              "Successfully managed large-scale logistics and outreach"
            ]
          }
        }
      ],

      achievements: [
        {
          category: "Student Leadership",
          icon: "BookOpen",
          color: "bg-blue-600",
          items: [
            {
              title: "First Democratic ANNISU (R) Chairman",
              description: "Historic election as the first democratically chosen Chairman of ANNISU (R) at the 21st national conference in Kathmandu, 2017",
              impact: "Set precedent for democratic processes in student organization leadership"
            },
            {
              title: "Education Reform Advocacy",
              description: "Led campaigns for free education and against privatization of educational institutions",
              impact: "Influenced policy discussions on accessible education for all economic backgrounds"
            },
            {
              title: "Merit-Based Leadership Promotion",
              description: "Advocated for transparent, merit-based selection in university leadership positions",
              impact: "Contributed to reforms in academic institutional governance"
            }
          ]
        },
        {
          category: "Political Leadership",
          icon: "Vote",
          color: "bg-green-600",
          items: [
            {
              title: "Central Committee Membership",
              description: "Appointed to Central Committee of CPN (Maoist Centre) in December 2021 under youth inclusion initiative",
              impact: "Represents voice of under-40 demographic in national political decision-making"
            },
            {
              title: "Youth Inclusion Pioneer",
              description: "Part of historic 20% under-40 quota implementation, joining 11 other young leaders",
              impact: "Helped establish framework for sustained youth participation in party leadership"
            },
            {
              title: "Policy Influence",
              description: "Active participant in Central Committee decisions affecting national policy direction",
              impact: "Ensured youth perspectives are integrated into major political strategies"
            }
          ]
        },
        {
          category: "Grassroots Engagement",
          icon: "Users",
          color: "bg-red-600",
          items: [
            {
              title: "Tarai-Madhes Campaign Leadership",
              description: "Appointed as Jhapa in-charge for the comprehensive 'Tarai-Madhes Awareness Campaign' in February 2025",
              impact: "Coordinated grassroots mobilization across multiple districts, strengthening party-community connections"
            },
            {
              title: "Community Outreach Programs",
              description: "Supervised extensive grassroots mobilization efforts coordinated by party leadership",
              impact: "Enhanced democratic participation and political awareness in rural communities"
            },
            {
              title: "Strategic Regional Coordination",
              description: "Successfully managed campaign operations from Jhapa to Kanchanpur",
              impact: "Demonstrated effective large-scale organizational and leadership capabilities"
            }
          ]
        },
        {
          category: "Social Advocacy",
          icon: "Heart",
          color: "bg-purple-600",
          items: [
            {
              title: "Healthcare Access Advocacy",
              description: "Consistent champion for free healthcare and universal access to medical services",
              impact: "Influenced party positions on healthcare reform and public health policy"
            },
            {
              title: "Social Justice Initiatives",
              description: "Promoted policies addressing systemic inequality and marginalization",
              impact: "Advanced discussions on inclusive governance and equal opportunity"
            },
            {
              title: "Government Accountability",
              description: "Emphasized role of student wings as watchdogs during political crises",
              impact: "Strengthened democratic oversight and institutional accountability mechanisms"
            }
          ]
        }
      ],

      mediaRecognition: {
        sectionTitle: "Media Recognition",
        sectionSubtitle: "Coverage and recognition in national media outlets",
        items: [
          {
            outlet: "The Annapurna Express",
            outletColor: "text-red-700 bg-red-100",
            title: "Student Leadership Interview",
            description: "Featured interview discussing the role of student organizations in democratic oversight and government accountability during political crises.",
            year: "2021",
            link: "https://theannapurnaexpress.com/news/interview-with-ranjit-tamang-4789"
          },
          {
            outlet: "Kathmandu Post",
            outletColor: "text-blue-700 bg-blue-100",
            title: "Central Committee Appointment",
            description: "Coverage of historic youth inclusion initiative and appointment to CPN (Maoist Centre) Central Committee representing under-40 demographic.",
            year: "December 2021"
          },
          {
            outlet: "Radio Nepal Online",
            outletColor: "text-green-700 bg-green-100",
            title: "Campaign Leadership",
            description: "Reports on successful coordination of Tarai-Madhes Awareness Campaign and grassroots mobilization efforts across multiple districts.",
            year: "February 2025",
            link: "https://radionepal.gov.np/news-detail/12345"
          }
        ]
      },

      futureGoals: {
        title: "Ongoing Commitments",
        description: "Building on past achievements to create lasting change in Nepal's political and social landscape. The focus continues on empowering youth, strengthening democratic institutions, and ensuring that progressive values translate into meaningful policy outcomes.",
        immediate: {
          title: "Immediate Priorities",
          items: [
            "Expand grassroots engagement programs",
            "Strengthen youth participation in governance",
            "Advance education and healthcare reforms",
            "Promote transparent, merit-based leadership"
          ]
        },
        longTerm: {
          title: "Long-term Vision",
          items: [
            "Establish comprehensive social justice framework",
            "Create sustainable democratic institutions",
            "Build inclusive political participation systems",
            "Develop next generation of progressive leaders"
          ]
        }
      }
    };

    // Create achievement document
    const achievement = new Achievement(achievementData);
    await achievement.save();

    console.log('✅ Achievement data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding achievement data:', error);
    process.exit(1);
  }
};

// Check for --force flag
const force = process.argv.includes('--force');

seedAchievementData(force);

