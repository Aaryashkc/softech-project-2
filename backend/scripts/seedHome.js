import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Home from '../models/Home.model.js';

const seedHomeData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Check if home data already exists
    const existingHome = await Home.findOne();
    
    if (existingHome) {
      console.log('⚠️  Home data already exists. Use --force to overwrite.');
      console.log('   Run: npm run seed:home -- --force');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Default home data (matching the structure from HomeModel.ts)
    const homeData = {
      hero: {
        name: "Ranjit Tamang",
        title: "Political Leader & Social Advocate",
        description: "Central Committee Member of CPN (Maoist Centre), dedicated to progressive politics and social justice in Nepal. Fighting for free education, healthcare, and equal opportunities for all Nepali citizens.",
        profileImage: "https://via.placeholder.com/400x400?text=Upload+Profile+Image", // Placeholder - upload via admin panel
        buttons: [
          {
            text: "Learn More",
            link: "/about",
            type: "primary"
          },
          {
            text: "Get in Touch",
            link: "/contact",
            type: "secondary"
          }
        ]
      },
      highlights: {
        sectionTitle: "Leadership & Impact",
        sectionSubtitle: "From student activism to national politics, a journey of dedication to Nepal's progress",
        items: [
          {
            icon: "Users",
            title: "Student Leadership",
            description: "First democratically elected Chairman of ANNISU (R) in 2017, championing student rights and educational reforms."
          },
          {
            icon: "Briefcase",
            title: "Party Leadership",
            description: "Central Committee Member of CPN (Maoist Centre) since 2021, representing the voice of youth in national politics."
          },
          {
            icon: "Heart",
            title: "Social Advocacy",
            description: "Passionate advocate for free education, healthcare, and social justice, working tirelessly for grassroots communities."
          }
        ]
      },
      initiatives: {
        sectionTitle: "Recent Initiatives",
        sectionSubtitle: "Current projects and campaigns making a difference",
        items: [
          {
            title: "Tarai-Madhes Awareness Campaign",
            description: "Leading the grassroots mobilization effort as Jhapa in-charge, connecting with communities across the region to strengthen democratic participation.",
            image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
            date: "February 2025",
            imageAlt: "Tarai-Madhes Campaign"
          },
          {
            title: "Youth Inclusion in Politics",
            description: "Part of the historic 20% under-40 quota implementation in the Central Committee, ensuring young voices shape Nepal's political future.",
            image: "https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
            date: "December 2021",
            imageAlt: "Youth Inclusion Initiative"
          }
        ]
      },
      cta: {
        title: "Join the Movement for Change",
        description: "Together, we can build a more just and equitable Nepal. Get involved in our initiatives for education, healthcare, and social progress.",
        buttonText: "Connect With Us",
        buttonLink: "/contact"
      }
    };

    // Delete existing home data if --force flag is used
    if (process.argv.includes('--force')) {
      await Home.deleteMany({});
      console.log('🗑️  Deleted existing home data');
    }

    // Create and save home data
    const home = new Home(homeData);
    await home.save();

    console.log('✅ Home data seeded successfully!');
    console.log('📝 You can now update the data via the admin panel at /admin');
    console.log('   Note: Profile image needs to be uploaded via admin panel');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding home data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedHomeData();

