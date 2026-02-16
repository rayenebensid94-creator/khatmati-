
import React from 'react';
import { UserProgress } from '../types';

interface SettingsProps {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  resetProgress: () => void;
}

const Settings: React.FC<SettingsProps> = ({ progress, updateProgress, resetProgress }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">إعدادات الخطة</h2>
            <p className="text-sm text-slate-500">قم بتخصيص طريقة الختم المناسبة لك</p>
        </div>
        
        <div className="p-6 space-y-8">
            <div className="space-y-4">
                <label className="block text-slate-700 font-bold">مدة الختمة (بالأيام)</label>
                <div className="grid grid-cols-4 gap-4">
                    {[10, 15, 20, 30].map(days => (
                        <button
                            key={days}
                            onClick={() => updateProgress({ targetKhatmaDays: days })}
                            className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                                progress.targetKhatmaDays === days 
                                ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' 
                                : 'bg-white text-slate-600 border-slate-100 hover:border-green-200'
                            }`}
                        >
                            {days}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-slate-700 font-bold">بداية الختمة</label>
                <input 
                    type="date" 
                    value={progress.startDate.split('T')[0]}
                    onChange={(e) => updateProgress({ startDate: new Date(e.target.value).toISOString() })}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-green-500 outline-none"
                />
            </div>

            <div className="pt-6 border-t border-slate-100">
                <button 
                    onClick={() => {
                        if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط كل التقدم؟ لا يمكن التراجع عن هذه الخطوة.')) {
                            resetProgress();
                        }
                    }}
                    className="text-red-600 font-bold hover:bg-red-50 px-6 py-2 rounded-xl transition-colors"
                >
                    إعادة ضبط التقدم بالكامل
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
