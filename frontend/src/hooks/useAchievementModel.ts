import { getIcon, type LucideIcon } from '../config/icon.config';
import { useAchievementStore, type AchievementData, type AchievementStat, type AchievementCategory } from '../stores/useAchievementStore';

// Extended types with icon components
export interface AchievementStatWithIcon extends Omit<AchievementStat, 'icon'> {
  icon: string;
  iconComponent: LucideIcon;
}

export interface AchievementCategoryWithIcon extends Omit<AchievementCategory, 'icon'> {
  icon: string;
  iconComponent: LucideIcon;
}

export interface AchievementModelWithIcons extends Omit<AchievementData, 'stats' | 'achievements'> {
  stats: AchievementStatWithIcon[];
  achievements: AchievementCategoryWithIcon[];
}

// Helper function to get achievement model with icon components
const getAchievementModel = (achievementData: AchievementData | null): AchievementModelWithIcons | null => {
  if (!achievementData) return null;
  
  return {
    ...achievementData,
    stats: achievementData.stats.map(stat => ({
      ...stat,
      iconComponent: getIcon(stat.icon)
    })),
    achievements: achievementData.achievements.map(category => ({
      ...category,
      iconComponent: getIcon(category.icon)
    }))
  } as AchievementModelWithIcons;
};

// Export a hook to use achievement data with icon mapping
export const useAchievementModel = () => {
  const { achievementData, fetchAchievement, isLoading } = useAchievementStore();
  
  return {
    achievementModel: getAchievementModel(achievementData),
    fetchAchievement,
    isLoading
  };
};

