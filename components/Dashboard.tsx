
import React from 'react';
import { UserProgress, DailyWird } from '../types';
import { TOTAL_PAGES } from '../constants';

interface DashboardProps {
  progress: UserProgress;
  wird: DailyWird;
  motivation: string;
  onStartReading: () => void;
  onCompleteDay: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, wird, motivation, onStartReading, onCompleteDay }) => {
  const progressPercent = Math.round((progress.lastReadPage / TOTAL_PAGES) * 100);
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Motivation Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-green-50 p-4 rounded-2xl">
          <span className="text-5xl">🌙</span>
        </div>
        <div className="flex-1 text-center md:text-right">
          <h3 className="text-green-800 font-bold text-lg mb-1">رسالة اليوم</h3>
          <p className="text-slate-600 italic">"{motivation}"</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2D6A4F] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-xl font-bold opacity-80 mb-2">تقدم الختمة</h2>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-6xl font-bold">{progressPercent}%</span>
                    <span className="text-lg opacity-80 mb-2">مكتمل</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                    <div 
                        className="bg-[#D4AF37] h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <p className="text-sm opacity-90">قرأت {progress.lastReadPage} من أصل {TOTAL_PAGES} صفحة</p>
            </div>
            {/* Decoration */}
            <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 rotate-12">📖</div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
                <h2 className="text-slate-500 font-bold mb-4">ورد اليوم</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">من صفحة</span>
                        <span className="text-2xl font-bold text-green-700">{wird.fromPage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">إلى صفحة</span>
                        <span className="text-2xl font-bold text-green-700">{wird.toPage}</span>
                    </div>
                    <hr className="border-slate-100" />
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">المجموع اليومي</span>
                        <span className="text-lg font-bold">{wird.toPage - wird.fromPage + 1} صفحة</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onStartReading}
                className="mt-6 w-full bg-[#D4AF37] hover:bg-[#b8972e] text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
                <span>ابدأ القراءة الآن</span>
                <span className="text-xl">📖</span>
            </button>
        </div>
      </div>

      {/* Quick Action */}
      {!wird.isCompleted && (
        <div className="bg-green-600 rounded-3xl p-6 shadow-md flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg">✨</div>
            <p className="font-medium">هل أتممت ورد اليوم بالفعل؟</p>
          </div>
          <button 
            onClick={onCompleteDay}
            className="bg-white text-green-700 font-bold px-6 py-2 rounded-xl hover:bg-green-50"
          >
            نعم، أتممت
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
