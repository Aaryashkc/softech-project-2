import { useEffect } from 'react';
import { useContactPageStore, type ContactData } from '../stores/useContactPageStore';
import { getIcon, type LucideIcon } from '../config/icon.config';

export interface ContactInfoItemWithIcon extends Omit<import('../stores/useContactPageStore').ContactInfoItem, 'icon'> {
  iconComponent: LucideIcon;
}

export interface ContactModelWithIcons extends Omit<ContactData, 'contactInfo' | 'additionalInfo'> {
  contactInfo: {
    sectionTitle?: string;
    items: ContactInfoItemWithIcon[];
  };
  additionalInfo: {
    publicEngagement: {
      title: string;
      description: string;
      items: string[];
      iconComponent: LucideIcon;
    };
    responseTime: {
      title: string;
      description: string;
      iconComponent: LucideIcon;
      times: import('../stores/useContactPageStore').ResponseTime[];
    };
    scheduleMeeting: {
      title: string;
      description: string;
      note: string;
      iconComponent: LucideIcon;
    };
  };
}

const getContactModel = (data: ContactData | null): ContactModelWithIcons | null => {
  if (!data) return null;

  return {
    ...data,
    contactInfo: {
      ...data.contactInfo,
      items: data.contactInfo.items.map(item => ({
        ...item,
        iconComponent: getIcon(item.icon),
      })),
    },
    additionalInfo: {
      publicEngagement: {
        ...data.additionalInfo.publicEngagement,
        iconComponent: getIcon(data.additionalInfo.publicEngagement.icon),
      },
      responseTime: {
        ...data.additionalInfo.responseTime,
        iconComponent: getIcon(data.additionalInfo.responseTime.icon),
      },
      scheduleMeeting: {
        ...data.additionalInfo.scheduleMeeting,
        iconComponent: getIcon(data.additionalInfo.scheduleMeeting.icon),
      },
    },
  };
};

export const useContactPageModel = () => {
  const { contactData, isLoading, error, fetchContact } = useContactPageStore();

  useEffect(() => {
    if (!contactData && !isLoading) {
      fetchContact();
    }
  }, [contactData, isLoading, fetchContact]);

  const contactModel = getContactModel(contactData);

  return {
    contactModel,
    isLoading,
    error,
    refetch: fetchContact,
  };
};

