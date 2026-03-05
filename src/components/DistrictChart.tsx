import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Award, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { DistrictData } from '../types';
import { cn } from '../lib/utils';

interface DistrictChartProps {
  data: DistrictData[];
}

const DistrictChart: React.FC<DistrictChartProps> = ({ data }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [data]);

  // Sort by conversion rate
  const sortedData = [...data].sort((a, b) => b.conversion - a.conversion);
  const topDistrict = sortedData[0];
  const avgConversion = data.reduce((sum, d) => sum + d.conversion, 0) / data.length;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">District Performance</h3>
            <p className="text-sm text-slate-500">Conversion & Acquisition Analysis</p>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Top Performer Badge */}
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">Top District</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-900">{topDistrict.name}</span>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-xs font-bold">
                  {topDistrict.conversion.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[180px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  dy={5}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  width={40}
                  domain={[0, 'dataMax + 50']}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200">
                          <p className="font-bold text-slate-900 mb-2">{data.name}</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Potential:</span>
                              <span className="font-bold text-slate-900">{data.potential}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Acquired:</span>
                              <span className="font-bold text-indigo-600">{data.acquired}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Conversion:</span>
                              <span className="font-bold text-emerald-600">{data.conversion.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="acquired" 
                  radius={[6, 6, 0, 0]} 
                  barSize={28}
                >
                  {sortedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.conversion >= avgConversion ? '#4f46e5' : '#94a3b8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* District List - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-2 pt-3 border-t border-slate-100">
            {sortedData.map((district, idx) => (
              <motion.div
                key={district.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                    idx === 0 ? "bg-amber-100 text-amber-700" :
                    idx === 1 ? "bg-slate-200 text-slate-700" :
                    idx === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-900 truncate">{district.name}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 leading-tight">Acquired</p>
                    <p className="text-xs font-bold text-slate-900 leading-tight">{district.acquired}/{district.potential}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1",
                    district.conversion >= avgConversion 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-slate-100 text-slate-600"
                  )}>
                    {district.conversion >= avgConversion ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {district.conversion.toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DistrictChart;
