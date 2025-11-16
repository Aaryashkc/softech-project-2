import { getIcon, type LucideIcon } from '../config/icon.config';
import { useHomeStore, type HomeData } from '../stores/useHomeStore';

// Extended type with icon components
export interface HomeModelWithIcons extends Omit<HomeData, 'highlights'> {
  highlights: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: Array<{
      icon: string;
      iconComponent: LucideIcon;
      title: string;
      description: string;
    }>;
  };
}

// Helper function to get home model with icon components
const getHomeModel = (homeData: HomeData | null): HomeModelWithIcons | null => {
  if (!homeData) return null;
  
  return {
    ...homeData,
    highlights: {
      ...homeData.highlights,
      items: homeData.highlights.items.map(item => ({
        ...item,
        iconComponent: getIcon(item.icon)
      }))
    }
  } as HomeModelWithIcons;
};

// Export a hook to use home data with icon mapping
export const useHomeModel = () => {
  const { homeData, fetchHome, isLoading } = useHomeStore();
  
  return {
    homeModel: getHomeModel(homeData),
    fetchHome,
    isLoading
  };
};

