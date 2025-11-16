import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import About from '../models/about.model.js';
import connectDB from '../lib/mongodb.js';

const seedAboutData = async (force = false) => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingData = await About.findOne();
    
    if (existingData && !force) {
      console.log('⚠️  About data already exists. Use --force to overwrite.');
      process.exit(0);
    }

    if (existingData && force) {
      await About.deleteOne();
      console.log('🗑️  Deleted existing about data');
    }

    // Seed data
    const aboutData = {
      hero: {
        title: "About Ranjit Tamang",
        subtitle: "A dedicated leader committed to progressive politics and social transformation in Nepal"
      },

      biography: {
        title: "Background & Early Life",
        image: "",
        paragraphs: [
          "रन्जित तामाङको जन्म पूर्वी नेपालको झापा जिल्लाको साविक तोपगाछी–२ वासबारी (हालको कमल गाउँपालिका–१) मा २०३९ माघ १९ गते (February 2, 1983) मा भएको हो। उनका बुबा लोकबहादुर तामाङ र आमा लाखमाया तामाङ हुन्। सात सन्तानमध्ये रन्जित जेठो छोरा हुन्। उनका अभिभावक सामान्य कृषक हुन् र कृषि पेसाबाटै परिवारको जीवन निर्वाह गर्दै आएका छन्।",
          "रन्जित तामाङले आफ्नो प्रारम्भिक शिक्षा नजिकैको श्री बाँसबारी निम्न माध्यमिक विद्यालयबाट सुरु गरेका थिए। उनले एसएलसी भने तत्कालीन तोपगाछी–२ स्थित श्री महेन्द्र रत्व माध्यमिक विद्यालयबाट उत्तीर्ण गरेका हुन्। त्यसपछि उनले महेन्द्र मोरङ कलेज, विराटनगरबाट आईए (Intermediate of Arts) अध्ययन गरे। पछि काठमाडौँको प्रदर्शनी मार्गस्थित रत्नराज्य लक्ष्मी क्याम्पसबाट स्नातक (BA) र त्रिभुवन विश्वविद्यालयबाट राजनीति शास्त्रमा स्नातकोत्तर (MA) सम्मको अध्ययन पूरा गरेका छन्।",
          "विद्यालय जीवनदेखि नै राजनीतिमा सक्रिय रन्जित नेकपा (माओवादी केन्द्र) को विद्यार्थी संगठन अनेरास्ववियु (क्रान्तिकारी) मा आवद्ध भए। उनी क्रमशः क्षेत्रीय सदस्य, जिल्ला सदस्य, झापा जिल्ला अध्यक्ष, केन्द्रीय सदस्य हुँदै २०७४ सालमा अनेरास्ववियुको पहिलो निर्वाचित केन्द्रीय समिति अध्यक्ष बन्न सफल भए।",
          "उनी आफ्नो कार्यकालमा विद्यार्थी आन्दोलनलाई नयाँ दिशा दिन सफल भए र सडक संघर्षमा अग्रणी नेतृत्व गरेका थिए। नेकपा (माओवादी केन्द्र) र नेकपा (एमाले) बीच एकता भएपछि उनी अनेरास्ववियुका सह–संयोजकको भूमिका निर्वाह गरेका थिए। हाल उनी नेकपा (माओवादी केन्द्र)का केन्द्रीय सदस्य तथा झापा जिल्ला इञ्चार्जका रूपमा क्रियाशील छन्।",
          "राजनीति मात्र होइन, उनी लेखनमा पनि सक्रिय छन्। विभिन्न खोजमूलक लेख, कविता, र गीतसमेत लेखेका छन्। उनले दुर्गा भट्टराईसँग विवाह गरेका छन् र एक छोरी आकृति तामाङ छन्।",
          "२०५८ सालको संकटकालीन समयमा उनी पक्राउ परी करिब दुई वर्षसम्म जेल जीवन बिताएका थिए। वर्तमानमा उनी नेपाली राजनीतिक वृत्तमा युवाहरूले मन पराउने उदीयमान नेता मध्येका एक मानिन्छन्।",
          "राजनीतिक, आर्थिक, सामाजिक र सांस्कृतिक रूपान्तरणको वकालत गर्दै आएका उनी उत्पीडित समुदायको हक अधिकार र सामाजिक न्यायका लागि अडिग छन्। आत्मनिर्भर अर्थतन्त्रका लागि मौलिक उत्पादन प्रणालीको आधुनिकीकरण गरी शिक्षा, स्वास्थ्य, रोजगारी र समृद्धिको लक्ष्यमा युवा पुस्ताले हातेमालो गर्नुपर्ने उनको परिवर्तनकारी सोच रहेको छ।"
        ]
      },

      coreValues: {
        sectionTitle: "Core Values & Principles",
        sectionSubtitle: "The fundamental beliefs that guide every decision and action",
        items: [
          {
            title: "Education for All",
            description: "Fighting for free, quality education accessible to every Nepali citizen, regardless of economic background.",
            icon: "GraduationCap"
          },
          {
            title: "Healthcare Access",
            description: "Advocating for universal healthcare that ensures medical treatment is a right, not a privilege.",
            icon: "Heart"
          },
          {
            title: "Social Justice",
            description: "Committed to creating an equitable society where every citizen has equal opportunities and rights.",
            icon: "Users"
          },
          {
            title: "Merit-Based Leadership",
            description: "Promoting transparent, merit-based systems in governance and institutional leadership.",
            icon: "Award"
          }
        ]
      },

      vision: {
        title: "Vision for Nepal",
        quote: "I envision a Nepal where every citizen has access to quality education and healthcare, where merit determines leadership, and where social justice is not just an ideal but a lived reality for all. Through grassroots engagement and progressive policies, we can build a more prosperous and equitable nation.",
        author: "Ranjit Tamang"
      },

      philosophy: {
        title: "Political Philosophy",
        paragraphs: [
          "My approach to politics is rooted in the belief that government must serve as a watchdog for the people, especially during times of political crisis. The student wings and grassroots organizations play a crucial role in holding leadership accountable and ensuring democratic principles are upheld.",
          "I advocate for systemic reforms that address the root causes of inequality and injustice in our society. This includes resisting the privatization of essential services like education and healthcare, while promoting policies that create opportunities for all citizens.",
          "True leadership comes from understanding the needs of the people at the grassroots level. This is why community engagement and direct dialogue with citizens remain central to my political work and decision-making process."
        ],
        priorities: {
          title: "Key Priorities",
          items: [
            "Free and accessible education for all",
            "Universal healthcare coverage",
            "Youth inclusion in governance",
            "Merit-based institutional leadership",
            "Grassroots community empowerment"
          ]
        }
      }
    };

    const about = new About(aboutData);
    await about.save();
    console.log('✅ About page data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding about data:', error);
    process.exit(1);
  }
};

// Check for --force flag
const force = process.argv.includes('--force');
seedAboutData(force);

