import React, { useState } from 'react';
import { Calendar, Image, Newspaper, Mic, Menu, X, LogOut, Plus, Home, Award, MapPin, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import EventManagement from './EventManagement';
import GalleryManagement from './GalleryManagement';
import NewsManagement from './NewsManagement';
import InterviewManagement from './InterviewManagement';
import HomeManagement from './HomeManagement';
import AchievementManagement from './AchievementManagement';
import JourneyManagement from './JourneyManagement';
import ContactManagement from './ContactManagement';
import AboutManagement from './AboutManagement';
import toast from 'react-hot-toast';
import AddEventPage from '../components/AddEventPage';
import AddGalleryPage from '../components/AddGalleryPage';
import AddNewsPage from '../components/AddNewsPage';
import AddInterviewPage from '../components/AddInterviewPage';

// Types
type SectionType = 'events' | 'gallery' | 'news' | 'interviews' | 'home' | 'achievement' | 'journey' | 'contact' | 'about' | 'add-event' | 'add-gallery' | 'add-news' | 'add-interview';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const menuItems = [
    { id: 'home' as SectionType, label: 'Home Page', icon: Home },
    { id: 'achievement' as SectionType, label: 'Achievement Page', icon: Award },
    { id: 'journey' as SectionType, label: 'Journey Page', icon: MapPin },
    { id: 'contact' as SectionType, label: 'Contact Page', icon: Mail },
    { id: 'about' as SectionType, label: 'About Page', icon: User },
    { id: 'events' as SectionType, label: 'Manage Events', icon: Calendar },
    { id: 'add-event' as SectionType, label: 'Add Event', icon: Plus },
    { id: 'gallery' as SectionType, label: 'Gallery Manager', icon: Image },
    { id: 'add-gallery' as SectionType, label: 'Add Gallery', icon: Plus },
    { id: 'news' as SectionType, label: 'News Management', icon: Newspaper },
    { id: 'add-news' as SectionType, label: 'Add News', icon: Plus },
    { id: 'interviews' as SectionType, label: 'Interviews', icon: Mic },
    { id: 'add-interview' as SectionType, label: 'Add Interview', icon: Plus },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col relative`}>
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold">Admin Panel</h2>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onSectionChange(item.id)}
                    className={`flex items-center rounded-lg transition-colors ${
                      isCollapsed
                        ? 'w-10 h-10 p-0 justify-center mx-auto'
                        : 'w-full gap-3 p-3'
                    } ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon size={isCollapsed ? 24 : 20} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`rounded-lg transition-colors text-red-400 hover:bg-red-900/20 flex items-center ${
            isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto' : 'w-full gap-3 p-3'
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={isCollapsed ? 24 : 20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>('events');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeManagement />;
      case 'achievement':
        return <AchievementManagement />;
      case 'journey':
        return <JourneyManagement />;
      case 'contact':
        return <ContactManagement />;
      case 'about':
        return <AboutManagement />;
      case 'events':
        return <EventManagement />;
      case 'add-event':
        return <AddEventPage />;
      case 'gallery':
        return <GalleryManagement />;
      case 'add-gallery':
        return <AddGalleryPage   />;
      case 'news':
        return <NewsManagement />;
      case 'add-news':
        return <AddNewsPage  />;
      case 'interviews':
        return <InterviewManagement />;
      case 'add-interview':
        return <AddInterviewPage />;
      default:
        return <EventManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;