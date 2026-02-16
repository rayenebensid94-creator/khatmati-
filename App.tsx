
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import Settings from './components/Settings';
import QuranReader from './components/QuranReader';
import { UserProgress, DailyWird, AppSection } from './types';
import { TOTAL_PAGES, DEFAULT_TARGET_DAYS, MOCK_MOTIVATION } from './constants';
import { getMotivationalMessage } from './services/geminiService';

const App: React.FC = () => {
  const [currentSection, setSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [motivation, setMotivation] = useState(MOCK_MOTIVATION[0]);
  
  // Initialize progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('khatmati_progress');
    if (saved) return JSON.parse(saved);
    return {
      lastReadPage: 0,
      completedDays: [],
      targetKhatmaDays: DEFAULT_TARGET_DAYS,
      startDate: new Date().toISOString()
    };
  });

  // Persist progress to localStorage
  useEffect(() => {
    localStorage.setItem('khatmati_progress', JSON.stringify(progress));
  }, [progress]);

  // Fetch motivational message via Gemini
  useEffect(() => {
    const fetchMotivation = async () => {
      const progressPercent = Math.round((progress.lastReadPage / TOTAL_PAGES) * 100);
      const daysPassed = Math.floor((new Date().getTime() - new Date(progress.startDate).getTime()) / (1000 * 3600 * 24));
      const daysLeft = Math.max(0, progress.targetKhatmaDays - daysPassed);
      
      const msg = await getMotivationalMessage(progressPercent, daysLeft);
      setMotivation(msg);
    };
    fetchMotivation();
  }, [progress.lastReadPage, progress.startDate, progress.targetKhatmaDays]);

  // Calculate Daily Wird
  const currentWird = useMemo<DailyWird>(() => {
    const remainingPages = TOTAL_PAGES - progress.lastReadPage;
    const diff = new Date().getTime() - new Date(progress.startDate).getTime();
    const currentDay = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
    const remainingDays = Math.max(1, progress.targetKhatmaDays - (currentDay - 1));
    
    const pagesPerDay = Math.ceil(remainingPages / remainingDays);
    const fromPage = progress.lastReadPage + 1;
    const toPage = Math.min(TOTAL_PAGES, progress.lastReadPage + pagesPerDay);

    return {
      dayNumber: currentDay,
      fromPage,
      toPage,
      isCompleted: progress.completedDays.includes(currentDay)
    };
  }, [progress]);

  const handleUpdateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page > progress.lastReadPage) {
      handleUpdateProgress({ lastReadPage: page });
    }
  }, [progress.lastReadPage, handleUpdateProgress]);

  const handleCompleteDay = () => {
    if (!progress.completedDays.includes(currentWird.dayNumber)) {
      handleUpdateProgress({
        lastReadPage: currentWird.toPage,
        completedDays: [...progress.completedDays, currentWird.dayNumber]
      });
    }
  };

  const handleReset = () => {
    setProgress({
      lastReadPage: 0,
      completedDays: [],
      targetKhatmaDays: DEFAULT_TARGET_DAYS,
      startDate: new Date().toISOString()
    });
    setSection(AppSection.DASHBOARD);
  };

  const isReaderOpen = currentSection === AppSection.READER;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* إخفاء الهيدر عند فتح المصحف */}
      {!isReaderOpen && <Header currentSection={currentSection} setSection={setSection} />}
      
      <main className={`flex-1 ${!isReaderOpen ? 'pb-24' : ''}`}>
        {currentSection === AppSection.DASHBOARD && (
          <Dashboard 
            progress={progress} 
            wird={currentWird}
            motivation={motivation}
            onStartReading={() => setSection(AppSection.READER)}
            onCompleteDay={handleCompleteDay}
          />
        )}
        
        {currentSection === AppSection.STATS && (
          <Stats progress={progress} />
        )}
        
        {currentSection === AppSection.SETTINGS && (
          <Settings 
            progress={progress} 
            updateProgress={handleUpdateProgress} 
            resetProgress={handleReset}
          />
        )}

        {currentSection === AppSection.READER && (
          <QuranReader 
            initialPage={progress.lastReadPage + 1}
            onPageChange={handlePageChange}
            onClose={() => setSection(AppSection.DASHBOARD)}
          />
        )}
      </main>

      {/* إخفاء شريط التقدم السفلي عند فتح المصحف */}
      {!isReaderOpen && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 md:hidden z-40">
          <div className="max-w-md mx-auto flex items-center justify-between text-xs font-bold text-slate-500">
              <div className="flex flex-col items-center">
                  <span>اليوم</span>
                  <span className="text-green-700 text-lg">{currentWird.dayNumber}</span>
              </div>
              <div className="flex flex-col items-center flex-1 mx-4">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                      <div className="bg-[#D4AF37] h-full rounded-full transition-all duration-500" style={{ width: `${(progress.lastReadPage/TOTAL_PAGES)*100}%` }}></div>
                  </div>
                  <span>التقدم: {Math.round((progress.lastReadPage/TOTAL_PAGES)*100)}%</span>
              </div>
              <div className="flex flex-col items-center">
                  <span>المتبقي</span>
                  <span className="text-green-700 text-lg">{TOTAL_PAGES - progress.lastReadPage}</span>
              </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
