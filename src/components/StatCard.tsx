import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon, Store, Users, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Stat } from '../types';

const iconMap: Record<string, LucideIcon> = {
  Store,
  Users,
  TrendingUp,
  Wallet
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
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all cursor-pointer overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity",
        getGradient()
      )} />
      
      {/* Decorative Circle */}
      <div className={cn(
        "absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity",
        stat.color
      )} />
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 transition-transform",
            getGradient()
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
            stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
            stat.trend === 'down' ? "bg-red-100 text-red-700" : 
            "bg-slate-100 text-slate-700"
          )}>
            {stat.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {stat.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {stat.trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            {stat.change.split(' ')[0]}
          </div>
        </div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
          <p className="text-xs text-slate-500 font-medium">{stat.change.split(' ').slice(1).join(' ')}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
