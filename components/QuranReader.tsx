
import React, { useState, useEffect, useRef } from 'react';
import { TOTAL_PAGES } from '../constants';

interface Ayah {
  number: number;
  text: string;
  surah: {
    name: string;
    englishName: string;
  };
  numberInSurah: number;
}

interface QuranReaderProps {
  initialPage: number;
  onPageChange: (page: number) => void;
  onClose: () => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({ initialPage, onPageChange, onClose }) => {
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(window.innerWidth < 768 ? 24 : 30);
  const [showUI, setShowUI] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [animating, setAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}/quran-uthmani-warsh`);
        const data = await response.json();
        
        if (data.code === 200 && data.data.ayahs.length > 0) {
          setAyahs(data.data.ayahs);
          onPageChange(currentPage);
          if (contentRef.current) contentRef.current.scrollTop = 0;
          
          // Trigger entry animation
          setAnimating(true);
          setTimeout(() => setAnimating(false), 500);
        } else {
          throw new Error("لم يتم العثور على بيانات لهذه الصفحة");
        }
      } catch (err) {
        setError("فشل في تحميل الصفحة. تأكد من اتصالك بالإنترنت.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [currentPage]);

  const next = () => {
    if (currentPage < TOTAL_PAGES && !loading) {
      setDirection('next');
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1 && !loading) {
      setDirection('prev');
      setCurrentPage(currentPage - 1);
    }
  };

  const currentSurah = ayahs.length > 0 ? ayahs[0].surah.name : "";

  // Animation logic classes
  const getAnimationClass = () => {
    if (!direction || !animating) return 'opacity-100 translate-x-0';
    if (direction === 'next') return 'animate-page-in-right';
    return 'animate-page-in-left';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col h-[100dvh] select-none overflow-hidden font-arabic">
      <style>{`
        @keyframes pageInRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pageInLeft {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-page-in-right { animation: pageInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-page-in-left { animation: pageInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .book-shadow {
          background: linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.03) 100%);
        }
        .spine-shadow {
          background: linear-gradient(90deg, transparent 48%, rgba(0,0,0,0.08) 50%, transparent 52%);
        }
      `}</style>
      
      {/* Header UI */}
      <div className={`absolute top-0 inset-x-0 z-[120] bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-center transition-all duration-500 ${showUI ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90">✕</button>
        <div className="text-center text-white">
          <h2 className="quran-font text-2xl text-[#D4AF37] drop-shadow-md transition-all">{currentSurah}</h2>
          <p className="text-[10px] opacity-70 tracking-[0.2em] uppercase">Page {currentPage}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFontSize(s => Math.min(s + 2, 45))} className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold hover:bg-white/20 transition-all">+</button>
          <button onClick={() => setFontSize(s => Math.max(s - 2, 18))} className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold hover:bg-white/20 transition-all">-</button>
        </div>
      </div>

      {/* Main Mushaf Content */}
      <div 
        className="flex-1 flex items-center justify-center p-2 md:p-6 lg:p-8 relative cursor-pointer overflow-hidden"
        onClick={() => setShowUI(!showUI)}
      >
        <div className="relative w-full max-w-2xl h-full max-h-[920px] bg-[#fdfaf1] rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden border-[1px] border-[#d4af37]/30 transition-transform duration-700">
          
          {/* Realism Overlays */}
          <div className="absolute inset-0 pointer-events-none book-shadow z-20"></div>
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full pointer-events-none spine-shadow z-20 opacity-40"></div>
          
          {/* Islamic Decorative Frame */}
          <div className="absolute inset-0 pointer-events-none border-[14px] md:border-[24px] border-double border-[#d4af37]/15 m-2 rounded z-30"></div>
          
          {/* Ornate Corners */}
          <div className="absolute top-0 right-0 w-20 h-20 border-t-[1px] border-r-[1px] border-[#d4af37]/40 m-2 z-30"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-[1px] border-l-[1px] border-[#d4af37]/40 m-2 z-30"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-[1px] border-r-[1px] border-[#d4af37]/40 m-2 z-30"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-[1px] border-l-[1px] border-[#d4af37]/40 m-2 z-30"></div>

          {/* Scrollable Text Area */}
          <div 
            ref={contentRef}
            className={`flex-1 overflow-y-auto px-8 md:px-14 py-12 md:py-20 scroll-smooth relative z-10 transition-all duration-300 ${getAnimationClass()}`}
          >
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37] text-xl">📖</div>
                </div>
                <p className="quran-font text-[#1B4332] text-2xl animate-pulse">يُرفع كلام الله...</p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-red-800 font-bold text-xl mb-6 leading-relaxed">{error}</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentPage(currentPage); }} 
                    className="bg-[#1B4332] text-white px-10 py-3 rounded-2xl shadow-xl hover:bg-green-800 transition-all active:scale-95 font-bold"
                >
                    إعادة المحاولة
                </button>
              </div>
            ) : (
              <div 
                className="quran-font text-slate-900 text-justify"
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: '3.2', 
                  direction: 'rtl',
                  textAlignLast: 'center',
                  filter: animating ? 'blur(1px)' : 'none',
                  transition: 'filter 0.3s'
                }}
              >
                {ayahs.map((ayah, index) => (
                  <React.Fragment key={`${currentPage}-${index}`}>
                    {/* Surah Header */}
                    {ayah.numberInSurah === 1 && (
                      <div className="w-full my-10 text-center bg-[#fdfaf1]/80 backdrop-blur-sm border-y-2 border-[#d4af37]/20 py-6 relative">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fdfaf1] px-4 text-[#d4af37] text-2xl">✨</div>
                         <h3 className="text-3xl md:text-4xl text-green-900 font-bold drop-shadow-sm mb-2">{ayah.surah.name}</h3>
                         {ayah.surah.name !== 'سُورَةُ التَّوۡبَةِ' && (
                           <div className="mt-8 text-3xl md:text-5xl text-slate-950 font-bold opacity-90 tracking-tight">
                             بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                           </div>
                         )}
                      </div>
                    )}
                    
                    <span className="inline-block hover:bg-[#D4AF37]/5 transition-all duration-300 rounded-lg px-2 py-1 mx-0.5">
                      {ayah.text.replace('بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ', '')}
                      <span className="inline-flex items-center justify-center mx-3 relative top-1.5 translate-y-[-2px]">
                         <span className="text-[#d4af37] text-[1.6em] opacity-60 leading-none">۝</span>
                         <span className="absolute inset-0 flex items-center justify-center text-[0.45em] font-sans font-extrabold text-slate-800 mt-1">{ayah.numberInSurah}</span>
                      </span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Page Indicator */}
          <div className="h-14 flex items-center justify-center border-t border-[#d4af37]/10 bg-[#fdfaf1] relative z-20">
             <div className="relative flex items-center justify-center">
                <span className="text-[#d4af37] text-5xl opacity-20">۞</span>
                <span className="absolute text-xs font-extrabold text-slate-700 tracking-widest">{currentPage}</span>
             </div>
          </div>
        </div>

        {/* Desktop Navigation Hover Areas */}
        <button 
          onClick={(e) => { e.stopPropagation(); prev(); }}
          disabled={currentPage <= 1 || loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-2/3 hidden lg:flex items-center justify-center text-white/5 hover:text-[#D4AF37]/60 hover:scale-110 transition-all z-[130] disabled:opacity-0 cursor-pointer"
        >
          <span className="text-8xl select-none">›</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); next(); }}
          disabled={currentPage >= TOTAL_PAGES || loading}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-24 h-2/3 hidden lg:flex items-center justify-center text-white/5 hover:text-[#D4AF37]/60 hover:scale-110 transition-all z-[130] disabled:opacity-0 cursor-pointer"
        >
          <span className="text-8xl select-none">‹</span>
        </button>
      </div>

      {/* Mobile/Global Control Bar */}
      <div className={`absolute bottom-0 inset-x-0 z-[120] bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col gap-6 transition-all duration-500 ${showUI ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        
        <div className="flex items-center gap-6">
            <button 
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentPage <= 1 || loading}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold shadow-2xl disabled:opacity-20 transition-all active:scale-95 border border-white/5 backdrop-blur-md"
            >
            السابقة
            </button>

            <div className="flex-[3] relative px-4 group">
                <input 
                    type="range" min="1" max={TOTAL_PAGES} value={currentPage} 
                    onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37] h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[10px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    PAGE {currentPage}
                </div>
            </div>

            <button 
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentPage >= TOTAL_PAGES || loading}
            className="flex-1 bg-[#d4af37] hover:bg-[#b8972e] text-white py-4 rounded-2xl font-bold shadow-2xl disabled:opacity-20 transition-all active:scale-95"
            >
            التالية
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuranReader;
