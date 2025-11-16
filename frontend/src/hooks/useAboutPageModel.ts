import { useEffect } from 'react';
import { useAboutPageStore, type AboutData } from '../stores/useAboutPageStore';
import { getIcon, type LucideIcon } from '../config/icon.config';

export interface CoreValueItemWithIcon extends Omit<import('../stores/useAboutPageStore').CoreValueItem, 'icon'> {
  iconComponent: LucideIcon;
}

export interface AboutModelWithIcons extends Omit<AboutData, 'coreValues'> {
  coreValues: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: CoreValueItemWithIcon[];
  };
}

const getAboutModel = (data: AboutData | null): AboutModelWithIcons | null => {
  if (!data) return null;

  return {
    ...data,
    coreValues: {
      ...data.coreValues,
      items: data.coreValues.items.map(item => ({
        ...item,
        iconComponent: getIcon(item.icon),
      })),
    },
  };
};

export const useAboutPageModel = () => {
  const { aboutData, isLoading, error, fetchAbout } = useAboutPageStore();

  useEffect(() => {
    if (!aboutData && !isLoading) {
      fetchAbout();
    }
  }, [aboutData, isLoading, fetchAbout]);

  const aboutModel = getAboutModel(aboutData);

  return {
    aboutModel,
    isLoading,
    error,
    refetch: fetchAbout,
  };
};

