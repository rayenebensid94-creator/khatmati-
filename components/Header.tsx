
import React from 'react';
import { AppSection } from '../types';

interface HeaderProps {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, setSection }) => {
  const navItems = [
    { id: AppSection.DASHBOARD, label: 'الرئيسية', icon: '🌙' },
    // Fix: Removed incorrect assignment in object literal property. AppSection.READER is read-only.
    { id: AppSection.READER, label: 'المصحف', icon: '📖' },
    { id: AppSection.STATS, label: 'الإحصائيات', icon: '📊' },
    { id: AppSection.SETTINGS, label: 'الإعدادات', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2D6A4F] text-white shadow-lg p-4 rounded-b-3xl">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">🌙</span>
          <span>ختمتي</span>
        </h1>
        <nav className="flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id as AppSection)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                currentSection === item.id ? 'bg-[#D4AF37] scale-105' : 'hover:bg-green-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
