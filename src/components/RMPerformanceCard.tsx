import React from 'react';
import { MapPin, Phone, Mail, TrendingUp, TrendingDown, Award, Target, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { RMPerformance } from '../types';
import { cn } from '../lib/utils';

interface RMPerformanceCardProps {
  rm: RMPerformance;
}

const RMPerformanceCard: React.FC<RMPerformanceCardProps> = ({ rm }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const isTop = rm.status === 'Top Performer';
  const isNeedsImprovement = rm.status === 'Needs Improvement';

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGradient = () => {
    if (isTop) return 'from-emerald-500 to-teal-600';
    if (isNeedsImprovement) return 'from-red-500 to-rose-600';
    return 'from-indigo-500 to-purple-600';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all overflow-hidden"
    >
      {/* Gradient Header */}
      <div className={cn(
        "h-24 bg-gradient-to-br relative overflow-hidden",
        getGradient()
      )}>
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
            isTop ? "bg-white/90 text-emerald-700 border-white/50" :
            isNeedsImprovement ? "bg-white/90 text-red-700 border-white/50" :
            "bg-white/90 text-indigo-700 border-white/50"
          )}>
            {rm.status}
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative px-5 -mt-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-slate-50 border-4 border-white shadow-xl flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-700">{getInitials(rm.name)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <h4 className="font-bold text-lg text-slate-900 mb-1">{rm.name}</h4>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <MapPin className="w-3 h-3" />
          <span>{rm.branch}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
            <Target className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500 font-semibold mb-0.5">Target</p>
            <p className="text-lg font-bold text-slate-900">{rm.targetLeads}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
            <Award className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <p className="text-xs text-indigo-600 font-semibold mb-0.5">Acquired</p>
            <p className="text-lg font-bold text-indigo-900">{rm.acquired}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs text-emerald-600 font-semibold mb-0.5">Conv.</p>
            <p className="text-lg font-bold text-emerald-900">{rm.conversion}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-500">Progress</span>
            <span className={cn(
              "font-bold",
              isTop ? "text-emerald-600" : isNeedsImprovement ? "text-red-600" : "text-indigo-600"
            )}>
              {rm.conversion}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${rm.conversion}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                isTop ? "from-emerald-500 to-teal-500" : 
                isNeedsImprovement ? "from-red-500 to-rose-500" : 
                "from-indigo-500 to-purple-500"
              )}
            />
          </div>
        </div>

        {/* Portfolio */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-xs text-amber-700 font-semibold">Portfolio</span>
          </div>
          <span className="text-sm font-bold text-amber-900">Rp {rm.portfolio}B</span>
        </div>

        {/* Toggle Details Button */}
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl font-semibold text-sm transition-all",
            showDetails 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        >
          <span>{showDetails ? 'Hide Contact' : 'View Contact'}</span>
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform",
            showDetails && "rotate-90"
          )} />
        </button>
        
        {/* Expandable Contact Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-slate-100 space-y-2"
          >
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Phone</p>
                <p className="text-xs font-bold text-slate-900">{rm.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-xs font-bold text-slate-900 truncate">{rm.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Territory</p>
                <p className="text-xs font-bold text-slate-900">{rm.territory}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RMPerformanceCard;
