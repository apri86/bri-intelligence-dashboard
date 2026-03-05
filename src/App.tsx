/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  Filter, 
  Download,
  ChevronDown,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import DistrictChart from './components/DistrictChart';
import RMPerformanceCard from './components/RMPerformanceCard';
import SimpleLeafletMap from './components/SimpleLeafletMap';
import Chatbot from './components/Chatbot';
import FilterPanel from './components/FilterPanel';
import TrendChart from './components/TrendChart';
import CategoryPieChart from './components/CategoryPieChart';
import AcquisitionFunnel from './components/AcquisitionFunnel';
import RMLeaderboard from './components/RMLeaderboard';
import CompetitiveAnalysis from './components/CompetitiveAnalysis';
import { 
  MOCK_STATS,
  MOCK_RM_DATA,
  MOCK_DISTRICT_PERFORMANCE,
  MOCK_TREND_DATA,
  MOCK_CATEGORY_DATA,
  MOCK_FUNNEL_DATA,
  MOCK_RM_LEADERBOARD,
  MOCK_COMPETITIVE_DATA
} from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTerritory, setSelectedTerritory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // Get unique territories and branches
  const territories = ['all', ...Array.from(new Set(MOCK_RM_DATA.map(rm => rm.territory)))];
  const branches = ['all', ...Array.from(new Set(MOCK_RM_DATA.map(rm => rm.branch)))];

  // Filter RM data
  const filteredRMData = MOCK_RM_DATA.filter(rm => {
    if (selectedTerritory !== 'all' && rm.territory !== selectedTerritory) return false;
    if (selectedBranch !== 'all' && rm.branch !== selectedBranch) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics, RMs, or territories..." 
                className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>Feb 26, 2026</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Welcome Section */}
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">BRI-Intelligence Dashboard</h2>
                    <p className="text-slate-500 mt-1 font-medium">Monitoring Jakarta Pusat Territory • Real-time Insights</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsFilterOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <button 
                      onClick={() => setActiveTab('chatbot')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Insights
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MOCK_STATS.map((stat, i) => (
                    <StatCard key={i} stat={stat} />
                  ))}
                </div>

                {/* Main Map & District Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-[500px]">
                    <SimpleLeafletMap />
                  </div>
                  <div className="h-[500px]">
                    <DistrictChart data={MOCK_DISTRICT_PERFORMANCE} />
                  </div>
                </div>

                {/* Analytics Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Business Analytics</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[400px]">
                      <TrendChart data={MOCK_TREND_DATA} />
                    </div>
                    <div className="h-[400px]">
                      <CategoryPieChart data={MOCK_CATEGORY_DATA} />
                    </div>
                  </div>
                </div>

                {/* Performance & Competition Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Performance & Competition</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-[420px]">
                      <AcquisitionFunnel data={MOCK_FUNNEL_DATA} />
                    </div>
                    <div className="h-[420px]">
                      <CompetitiveAnalysis data={MOCK_COMPETITIVE_DATA} />
                    </div>
                  </div>
                </div>

                {/* RM Performance Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">RM Performance</h3>
                  </div>
                  
                  {/* Leaderboard */}
                  <div className="h-[500px]">
                    <RMLeaderboard data={MOCK_RM_LEADERBOARD} />
                  </div>
                </div>

                {/* Opportunity Alerts */}
                <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl -ml-10 -mb-10" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-indigo-100">
                        <Sparkles className="w-3 h-3" />
                        AI Opportunity Alert
                      </div>
                      <h3 className="text-2xl font-bold leading-tight">High Potential TAM Detected in Thamrin Area</h3>
                      <p className="text-indigo-100/80 text-sm max-w-xl">
                        Our AI analysis shows a 45% penetration gap in the Thamrin district. Demographic data indicates high income growth and a 30% increase in new merchant registrations in the last 30 days.
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg">
                          Deploy RM Team
                        </button>
                        <button className="px-6 py-3 bg-indigo-800 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all border border-indigo-700">
                          Analyze Deep Dive
                        </button>
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex flex-col gap-3">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Est. Growth</p>
                          <p className="text-lg font-bold">+Rp 2.4B CASA</p>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Risk Level</p>
                          <p className="text-lg font-bold">Low (Stable)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'maps' && (
              <motion.div 
                key="maps"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-[calc(100vh-160px)]"
              >
                <SimpleLeafletMap />
              </motion.div>
            )}

            {activeTab === 'rm' && (
              <motion.div 
                key="rm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Relationship Manager Performance</h2>
                    <p className="text-slate-500 mt-1">Manage and monitor RM performance across territories</p>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">Filter by:</span>
                    </div>
                    
                    <select
                      value={selectedTerritory}
                      onChange={(e) => setSelectedTerritory(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {territories.map(territory => (
                        <option key={territory} value={territory}>
                          {territory === 'all' ? 'All Territories' : territory}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {branches.map(branch => (
                        <option key={branch} value={branch}>
                          {branch === 'all' ? 'All Branches' : branch}
                        </option>
                      ))}
                    </select>

                    <div className="flex-1" />

                    <div className="text-sm text-slate-500">
                      Showing <span className="font-bold text-slate-900">{filteredRMData.length}</span> of <span className="font-bold text-slate-900">{MOCK_RM_DATA.length}</span> RMs
                    </div>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="h-[550px]">
                  <RMLeaderboard data={MOCK_RM_LEADERBOARD} />
                </div>

                {/* RM Cards Grid */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">All Relationship Managers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRMData.map((rm) => (
                      <RMPerformanceCard key={rm.id} rm={rm} />
                    ))}
                  </div>
                  
                  {filteredRMData.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl">
                      <p className="text-slate-500">No RMs found matching the selected filters.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'chatbot' && (
              <motion.div 
                key="chatbot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[calc(100vh-160px)] flex justify-center"
              >
                <div className="w-full max-w-4xl">
                  <Chatbot />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Chat Trigger (only visible when not on chatbot tab) */}
      {activeTab !== 'chatbot' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setActiveTab('chatbot')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-300 flex items-center justify-center hover:bg-indigo-700 transition-all z-50 group"
        >
          <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
            Ask BRI AI
          </div>
        </motion.button>
      )}

      {/* Filter Panel */}
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
