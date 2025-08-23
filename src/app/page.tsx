import Link from 'next/link';
import { ArrowRightIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ToolsIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
              <p className="text-gray-600">Szabó Suti László eszközei</p>
            </div>
            <div className="text-sm text-gray-500">
              <a href="https://szabosutilaszlo.com" className="hover:text-blue-600 transition-colors">
                ← Vissza a főoldalra
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Intro Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ingyenes Online Eszközök
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudományosan megalapozott tesztek és felmérések, amelyek segítenek jobban megismerni önmagad.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-8">
            
            {/* ADHD Quick Check Tool */}
            <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <ChartBarIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">ADHD Gyorsteszt</h3>
                      <p className="text-emerald-600 font-medium">5 perces felmérés</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>5 perc</span>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      Ingyenes
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Tudományosan megalapozott ADHD szűrőteszt, amely segít felmérni a figyelem, impulzivitás 
                  és szervezettség terén tapasztalt nehézségeket. Azonnali, személyre szabott eredménnyel.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">12,000+</div>
                    <div className="text-sm text-gray-600">Kitöltő</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">Elégedettség</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">★ 4.8</div>
                    <div className="text-sm text-gray-600">Értékelés</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/hu/adhd-quick-check/" 
                    className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors group-hover:scale-[1.02] transform duration-200"
                  >
                    Teszt indítása
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                  <Link 
                    href="/hu/adhd-quick-check/" 
                    className="inline-flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    További információ
                  </Link>
                </div>
              </div>
            </div>

            {/* Coming Soon Tools */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">További eszközök hamarosan</h3>
                <p className="text-gray-500">
                  Dolgozunk további hasznos teszteken és felméréseken, amelyek segítenek a személyes fejlődésben.
                </p>
              </div>
            </div>

          </div>

          {/* Footer Info */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-2">Tudományos megalapozottság</h4>
              <p className="text-gray-600 text-sm">
                Minden eszköz nemzetközileg elfogadott módszereken alapul, és csak tájékoztató jellegű. 
                Szakmai diagnózishoz mindig fordulj szakemberhez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
