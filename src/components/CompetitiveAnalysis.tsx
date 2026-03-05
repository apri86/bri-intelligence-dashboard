import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Building2 } from 'lucide-react';

interface CompetitiveData {
  district: string;
  bri: number;
  mandiri: number;
  bca: number;
  bni: number;
}

interface CompetitiveAnalysisProps {
  data: CompetitiveData[];
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Competitive Analysis</h3>
            <p className="text-sm text-slate-500">Market Share by District</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="district" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
              iconType="circle"
            />
            <Bar dataKey="bri" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} name="BRI" />
            <Bar dataKey="mandiri" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} name="Mandiri" />
            <Bar dataKey="bca" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} name="BCA" />
            <Bar dataKey="bni" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} name="BNI" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Market Share Summary */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'BRI', value: 35, color: 'bg-indigo-600' },
            { name: 'Mandiri', value: 28, color: 'bg-yellow-500' },
            { name: 'BCA', value: 22, color: 'bg-cyan-500' },
            { name: 'BNI', value: 15, color: 'bg-orange-500' },
          ].map((bank, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-full h-1.5 ${bank.color} rounded-full mb-1.5`} />
              <p className="text-xs font-bold text-slate-700">{bank.name}</p>
              <p className="text-base font-bold text-slate-900">{bank.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;
