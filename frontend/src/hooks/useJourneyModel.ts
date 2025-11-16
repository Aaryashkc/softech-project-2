import { getIcon, type LucideIcon } from '../config/icon.config';
import { useJourneyStore, type JourneyData, type MilestoneItem, type LeadershipPhase, type InterviewInsight } from '../stores/useJourneyStore';

// Extended types with icon components
export interface MilestoneItemWithIcon extends Omit<MilestoneItem, 'icon'> {
  icon: string;
  iconComponent: LucideIcon;
}

export interface LeadershipPhaseWithIcon extends Omit<LeadershipPhase, 'icon'> {
  icon: string;
  iconComponent: LucideIcon;
}

export interface InterviewInsightWithIcon extends Omit<InterviewInsight, 'icon'> {
  icon: string;
  iconComponent: LucideIcon;
}

export interface JourneyModelWithIcons extends Omit<JourneyData, 'milestones' | 'leadershipPhases' | 'interviewInsights'> {
  milestones: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: MilestoneItemWithIcon[];
  };
  leadershipPhases: {
    sectionTitle: string;
    sectionSubtitle: string;
    phases: LeadershipPhaseWithIcon[];
  };
  interviewInsights: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: InterviewInsightWithIcon[];
  };
}

// Helper function to get journey model with icon components
const getJourneyModel = (journeyData: JourneyData | null): JourneyModelWithIcons | null => {
  if (!journeyData) return null;
  
  return {
    ...journeyData,
    milestones: {
      ...journeyData.milestones,
      items: journeyData.milestones.items.map(item => ({
        ...item,
        iconComponent: getIcon(item.icon)
      }))
    },
    leadershipPhases: {
      ...journeyData.leadershipPhases,
      phases: journeyData.leadershipPhases.phases.map(phase => ({
        ...phase,
        iconComponent: getIcon(phase.icon)
      }))
    },
    interviewInsights: {
      ...journeyData.interviewInsights,
      items: journeyData.interviewInsights.items.map(item => ({
        ...item,
        iconComponent: getIcon(item.icon)
      }))
    }
  } as JourneyModelWithIcons;
};

// Export a hook to use journey data with icon mapping
export const useJourneyModel = () => {
  const { journeyData, fetchJourney, isLoading } = useJourneyStore();
  
  return {
    journeyModel: getJourneyModel(journeyData),
    fetchJourney,
    isLoading
  };
};

