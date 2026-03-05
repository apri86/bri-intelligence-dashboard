import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, AlertTriangle, Phone, Mail, MapPin, X, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface RMLeaderboardData {
  rank: number;
  name: string;
  acquired: number;
  conversion: number;
  casa: number;
  trend: 'up' | 'down' | 'stable';
  phone: string;
  email: string;
  territory: string;
}

interface RMLeaderboardProps {
  data: RMLeaderboardData[];
}

const RMLeaderboard: React.FC<RMLeaderboardProps> = ({ data }) => {
  const [selectedRM, setSelectedRM] = useState<RMLeaderboardData | null>(null);

  // Get top 5 and bottom 5
  const topPerformers = data.slice(0, 5);
  const bottomPerformers = data.slice(-5).reverse();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-slate-400" />;
      case 3:
        return <Award className="w-4 h-4 text-orange-600" />;
      default:
        return <span className="text-xs font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      case 2:
        return 'bg-gradient-to-r from-slate-300 to-slate-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-slate-100';
    }
  };

  const getStatusBadge = (conversion: number) => {
    if (conversion >= 80) return { label: 'Top Performer', color: 'bg-emerald-100 text-emerald-700' };
    if (conversion >= 60) return { label: 'On Track', color: 'bg-blue-100 text-blue-700' };
    if (conversion >= 40) return { label: 'Needs Attention', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700' };
  };

  const renderRMItem = (rm: RMLeaderboardData, idx: number, isBottom: boolean = false) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03 }}
      onClick={() => setSelectedRM(rm)}
      className={cn(
        "p-2.5 rounded-xl border transition-all hover:shadow-md cursor-pointer",
        rm.rank <= 3 && !isBottom ? "border-transparent" : "border-slate-200 bg-white"
      )}
      style={rm.rank <= 3 && !isBottom ? { 
        background: `linear-gradient(135deg, ${
          rm.rank === 1 ? '#fef3c7' : rm.rank === 2 ? '#f1f5f9' : '#fed7aa'
        } 0%, white 100%)`
      } : {}}
    >
      <div className="flex items-center gap-2.5">
        {/* Rank Badge */}
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          isBottom ? "bg-red-100" : getRankBadge(rm.rank)
        )}>
          {isBottom ? (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          ) : (
            getRankIcon(rm.rank)
          )}
        </div>

        {/* RM Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="font-bold text-slate-900 truncate text-xs hover:text-indigo-600 transition-colors">{rm.name}</h4>
            {rm.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
            {rm.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <span><span className="font-bold text-slate-900">{rm.acquired}</span> acq</span>
            <span className="text-slate-300">•</span>
            <span><span className="font-bold text-slate-900">{rm.conversion}%</span> conv</span>
            <span className="text-slate-300">•</span>
            <span><span className="font-bold text-slate-900">Rp {rm.casa}B</span></span>
          </div>
        </div>

        {/* Conversion Badge */}
        <div className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
          rm.conversion >= 80 ? "bg-emerald-100 text-emerald-700" :
          rm.conversion >= 60 ? "bg-blue-100 text-blue-700" :
          rm.conversion >= 40 ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-700"
        )}>
          {rm.conversion}%
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">RM Leaderboard</h3>
              <p className="text-sm text-slate-500">Top & Bottom Performers</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Top 5 Performers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Top 5</h4>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-emerald-500 to-transparent rounded-full" />
            </div>
            {topPerformers.map((rm, idx) => renderRMItem(rm, idx, false))}
          </div>

          {/* Bottom 5 Performers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-red-500 to-transparent rounded-full" />
              <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">Bottom 5</h4>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-red-500 to-transparent rounded-full" />
            </div>
            {bottomPerformers.map((rm, idx) => renderRMItem(rm, idx, true))}
          </div>
        </div>
      </div>

      {/* RM Detail Modal */}
      <AnimatePresence>
        {selectedRM && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRM(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                <button
                  onClick={() => setSelectedRM(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-white",
                    selectedRM.rank <= 3 ? getRankBadge(selectedRM.rank) : "bg-white/20"
                  )}>
                    {selectedRM.rank <= 3 ? (
                      getRankIcon(selectedRM.rank)
                    ) : (
                      <span className="text-2xl font-bold">#{selectedRM.rank}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{selectedRM.name}</h3>
                    <p className="text-indigo-100 text-sm">Relationship Manager</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-bold",
                    getStatusBadge(selectedRM.conversion).color
                  )}>
                    {getStatusBadge(selectedRM.conversion).label}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Acquired</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedRM.acquired}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Conv.</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedRM.conversion}%</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">CASA</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedRM.casa}B</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold">Portfolio</p>
                      <p className="text-sm font-bold text-slate-900">Rp {selectedRM.casa}B CASA</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold">Phone</p>
                      <p className="text-sm font-bold text-slate-900">{selectedRM.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold">Email</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{selectedRM.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-semibold">Territory</p>
                      <p className="text-sm font-bold text-slate-900">{selectedRM.territory}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RMLeaderboard;
