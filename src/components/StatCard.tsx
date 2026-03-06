import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon, Store, Users, TrendingUp, Wallet, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Stat } from '../types';

const iconMap: Record<string, LucideIcon> = {
  Store,
  Users,
  TrendingUp,
  Wallet,
  Target
};

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const Icon = iconMap[stat.icon];
  
  const getGradient = () => {
    if (stat.color.includes('indigo')) return 'from-indigo-500 to-purple-600';
    if (stat.color.includes('purple')) return 'from-purple-500 to-pink-600';
    if (stat.color.includes('emerald')) return 'from-emerald-500 to-teal-600';
    if (stat.color.includes('amber')) return 'from-amber-500 to-orange-600';
    return 'from-slate-500 to-slate-600';
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity",
        getGradient()
      )} />
      
      {/* Decorative Circle */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity",
        stat.color
      )} />
      
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-br text-white shadow-md group-hover:scale-105 transition-transform shrink-0",
            getGradient()
          )}>
            <Icon className="w-5 h-5" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</h3>
            
            {/* Trend Badge */}
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold",
                stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
                stat.trend === 'down' ? "bg-red-100 text-red-700" : 
                "bg-slate-100 text-slate-700"
              )}>
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                {stat.trend === 'neutral' && <Minus className="w-3 h-3" />}
                {stat.change.split(' ')[0]}
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">{stat.change.split(' ').slice(1).join(' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
