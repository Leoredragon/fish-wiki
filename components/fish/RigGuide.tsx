'use client';

import { useLocale } from 'next-intl';
import { Settings, Anchor, Zap, PenTool } from 'lucide-react';

export default function RigGuide({ recommendedGear, waterType }: { recommendedGear: string, waterType: string }) {
  const locale = useLocale();
  const isTr = locale === 'tr';

  const gearText = recommendedGear?.toLowerCase() || '';
  
  // Determine Rig Type
  let rigType = 'basic';
  if (gearText.includes('lrf') || gearText.includes('spin')) {
    rigType = 'lrf_spin';
  } else if (gearText.includes('sörf') || gearText.includes('surf') || gearText.includes('dip')) {
    rigType = 'surf_bottom';
  } else if (waterType?.toLowerCase() === 'tatlı su' || waterType?.toLowerCase() === 'freshwater' || gearText.includes('sazan')) {
    rigType = 'hair_rig';
  }

  const renderLRFSpin = () => (
    <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-inner">
      <div className="absolute top-0 right-0 bg-emerald-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
        {isTr ? 'Spin / LRF Takımı' : 'Spin / LRF Rig'}
      </div>
      <div className="flex flex-col items-center mt-6">
        {/* Main Line */}
        <div className="w-1 h-12 bg-white/20 relative">
          <div className="absolute top-2 -right-16 text-[10px] text-white/50">{isTr ? 'İp Misina (PE)' : 'Braid Line (PE)'}</div>
        </div>
        {/* Lider Düğümü */}
        <div className="w-3 h-3 rounded-full bg-emerald-500 z-10 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
        <div className="text-[10px] text-emerald-400 mt-1 mb-2 font-bold tracking-wide">{isTr ? 'Lider Düğümü (FG / Albright)' : 'Leader Knot (FG / Albright)'}</div>
        {/* Fluorocarbon Lider */}
        <div className="w-0.5 h-16 bg-white/40 border-l border-dashed border-white/60 relative">
          <div className="absolute top-4 -left-20 text-[10px] text-white/50">{isTr ? 'Fluorocarbon Lider' : 'Fluorocarbon Leader'}</div>
        </div>
        {/* Klips veya Jighead */}
        <div className="w-4 h-4 border-2 border-white/80 rounded-full mt-1 relative">
          <div className="w-1 h-3 bg-white/80 absolute top-4 left-1"></div>
        </div>
        <div className="text-[10px] text-white mt-4 font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          {isTr ? 'Jighead & Silikon / Maket Balık' : 'Jighead & Soft Lure / Hard Bait'}
        </div>
      </div>
    </div>
  );

  const renderSurfBottom = () => (
    <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-inner">
      <div className="absolute top-0 right-0 bg-blue-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
        {isTr ? 'Yemli Dip / Surf' : 'Bottom / Surf Rig'}
      </div>
      <div className="flex flex-col items-center mt-6">
        {/* Main Line */}
        <div className="w-1 h-8 bg-white/20"></div>
        {/* Fırdöndü */}
        <div className="w-4 h-4 rounded-full border-2 border-slate-400 z-10 flex justify-center items-center">
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
        </div>
        <div className="text-[10px] text-blue-400 mt-1 mb-1 font-bold">{isTr ? 'Fırdöndü (Swivel)' : 'Swivel'}</div>
        {/* Beden */}
        <div className="w-1 h-12 bg-white/30 relative">
          {/* Köstek 1 */}
          <div className="absolute top-4 left-1 w-16 h-0.5 bg-white/40"></div>
          <div className="absolute top-2 left-18 transform rotate-45 w-4 h-4 border-b-2 border-r-2 border-white/80 rounded-br-full"></div>
          <div className="absolute top-7 left-20 text-[9px] text-white/50 w-20">{isTr ? 'İğne & Yem' : 'Hook & Bait'}</div>
        </div>
        <div className="w-1 h-12 bg-white/30 relative">
          {/* Köstek 2 */}
          <div className="absolute top-4 left-1 w-16 h-0.5 bg-white/40"></div>
          <div className="absolute top-2 left-18 transform rotate-45 w-4 h-4 border-b-2 border-r-2 border-white/80 rounded-br-full"></div>
        </div>
        {/* Kurşun */}
        <div className="w-6 h-8 bg-slate-400 rounded-b-xl rounded-t-sm mt-1 flex items-center justify-center">
          <span className="text-[10px] text-slate-900 font-bold">50g+</span>
        </div>
        <div className="text-[10px] text-white/60 mt-2 font-bold uppercase">{isTr ? 'Armut/Surf Kurşun' : 'Sinker / Lead'}</div>
      </div>
    </div>
  );

  const renderHairRig = () => (
    <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-inner">
      <div className="absolute top-0 right-0 bg-amber-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
        {isTr ? 'Sazan / Hair Rig' : 'Carp / Hair Rig'}
      </div>
      <div className="flex flex-col items-center mt-6">
        {/* Braid */}
        <div className="w-1 h-12 bg-emerald-700/50 relative">
          <div className="absolute top-2 -right-16 text-[10px] text-white/50">{isTr ? 'Köste (Braid)' : 'Hooklink'}</div>
        </div>
        {/* Hook */}
        <div className="relative">
          {/* Hook shape */}
          <div className="w-6 h-10 border-l-2 border-b-2 border-r-2 border-slate-300 rounded-b-full"></div>
          <div className="w-2 h-2 border-t-2 border-l-2 border-slate-300 absolute -right-0.5 bottom-2 transform rotate-45"></div>
          {/* Hair */}
          <div className="w-0.5 h-10 bg-emerald-700/50 absolute top-10 left-3"></div>
          {/* Boilie */}
          <div className="w-5 h-5 bg-amber-500 rounded-full absolute top-[70px] left-0.5 shadow-lg shadow-amber-500/20"></div>
          <div className="w-2 h-0.5 bg-black absolute top-[92px] left-2"></div> {/* Stopper */}
        </div>
        <div className="mt-16 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full">
          {isTr ? 'Boilie & Stoper (Hair Rig)' : 'Boilie & Stopper (Hair Rig)'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#0F172A]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">{isTr ? 'Taktik ve Montaj Şeması' : 'Tactical Rig Guide'}</h2>
          <p className="text-slate-500 text-sm font-medium">
            {isTr ? 'Bu balık için önerilen ideal donanım.' : 'Recommended rig setup for this target.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Area */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-700">{isTr ? 'Av Stratejisi' : 'Strategy'}</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {isTr 
                  ? 'Hedef balığın beslenme alışkanlığına ve su yapısına uygun montaj kullanmak av verimini %80 artırır.' 
                  : 'Matching your rig to the target’s feeding habits and water column increases catch rate significantly.'}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <PenTool className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-700">{isTr ? 'Önerilen Ekipman' : 'Suggested Gear'}</h4>
              <p className="text-sm text-slate-600 mt-1 font-semibold bg-slate-50 p-2 rounded-lg inline-block">
                {recommendedGear || (isTr ? 'Genel Yemli Takım' : 'General Bait Rig')}
              </p>
            </div>
          </div>
        </div>

        {/* Diagram Area */}
        <div className="w-full">
          {rigType === 'lrf_spin' && renderLRFSpin()}
          {rigType === 'surf_bottom' && renderSurfBottom()}
          {rigType === 'hair_rig' && renderHairRig()}
          {rigType === 'basic' && renderLRFSpin() /* Fallback */}
        </div>
      </div>
    </div>
  );
}
