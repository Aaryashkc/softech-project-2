import { Users, Briefcase, Heart } from 'lucide-react';
import Profile from "../assets/profile.jpeg";

export const homeModel = {
  // Hero Section Data
  hero: {
    name: "Ranjit Tamang",
    title: "Political Leader & Social Advocate",
    description: "Central Committee Member of CPN (Maoist Centre), dedicated to progressive politics and social justice in Nepal. Fighting for free education, healthcare, and equal opportunities for all Nepali citizens.",
    profileImage: Profile,
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
        id: 1,
        icon: "Users", 
        iconComponent: Users, 
        title: "Student Leadership",
        description: "First democratically elected Chairman of ANNISU (R) in 2017, championing student rights and educational reforms."
      },
      {
        id: 2,
        icon: "Briefcase",
        iconComponent: Briefcase,
        title: "Party Leadership",
        description: "Central Committee Member of CPN (Maoist Centre) since 2021, representing the voice of youth in national politics."
      },
      {
        id: 3,
        icon: "Heart",
        iconComponent: Heart,
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
        id: 1,
        title: "Tarai-Madhes Awareness Campaign",
        description: "Leading the grassroots mobilization effort as Jhapa in-charge, connecting with communities across the region to strengthen democratic participation.",
        image: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
        date: "February 2025",
        imageAlt: "Tarai-Madhes Campaign"
      },
      {
        id: 2,
        title: "Youth Inclusion in Politics",
        description: "Part of the historic 20% under-40 quota implementation in the Central Committee, ensuring young voices shape Nepal's political future.",
        image: "https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
        date: "December 2021",
        imageAlt: "Youth Inclusion Initiative"
      }
    ]
  },

  // Call to Action Section Data
  cta: {
    title: "Join the Movement for Change",
    description: "Together, we can build a more just and equitable Nepal. Get involved in our initiatives for education, healthcare, and social progress.",
    buttonText: "Connect With Us",
    buttonLink: "/contact"
  }
};