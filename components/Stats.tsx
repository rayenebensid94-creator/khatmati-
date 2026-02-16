
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserProgress } from '../types';
import { TOTAL_PAGES, COLORS } from '../constants';

interface StatsProps {
  progress: UserProgress;
}

const Stats: React.FC<StatsProps> = ({ progress }) => {
  // Generate mock weekly data
  const data = [
    { name: 'السبت', pages: 20 },
    { name: 'الأحد', pages: 18 },
    { name: 'الاثنين', pages: 25 },
    { name: 'الثلاثاء', pages: 0 },
    { name: 'الأربعاء', pages: 30 },
    { name: 'الخميس', pages: 22 },
    { name: 'الجمعة', pages: 40 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">نشاطك الأسبوعي</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="pages" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pages > 20 ? COLORS.primary : COLORS.secondary} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-sm mb-1">أعلى إنجاز</p>
            <p className="text-2xl font-bold text-green-700">40</p>
            <p className="text-xs text-slate-400">صفحة/يوم</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-sm mb-1">أيام الالتزام</p>
            <p className="text-2xl font-bold text-green-700">{progress.completedDays.length}</p>
            <p className="text-xs text-slate-400">يوماً</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-sm mb-1">المعدل اليومي</p>
            <p className="text-2xl font-bold text-green-700">22</p>
            <p className="text-xs text-slate-400">صفحة</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-400 text-sm mb-1">باقي للختم</p>
            <p className="text-2xl font-bold text-green-700">{TOTAL_PAGES - progress.lastReadPage}</p>
            <p className="text-xs text-slate-400">صفحة</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
