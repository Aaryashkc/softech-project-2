import React, { useState } from 'react';
import { Calendar, Image, Newspaper, Mic, Menu, X, LogOut } from 'lucide-react';
import EventManagement from './EventManagement';
import GalleryManagement from './GalleryManagement';
import NewsManagement from './NewsManagement';
import InterviewManagement from './InterviewManagement';
import toast from 'react-hot-toast';

// Types
type SectionType = 'events' | 'gallery' | 'news' | 'interviews';

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
  const menuItems = [
    { id: 'events' as SectionType, label: 'Manage Events', icon: Calendar },
    { id: 'gallery' as SectionType, label: 'Gallery Manager', icon: Image },
    { id: 'news' as SectionType, label: 'News Management', icon: Newspaper },
    { id: 'interviews' as SectionType, label: 'Interviews', icon: Mic },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
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
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={()=> toast.success('Logged out successfully!')}
          className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} />
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
      case 'events':
        return <EventManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'news':
        return <NewsManagement />;
      case 'interviews':
        return <InterviewManagement />;
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