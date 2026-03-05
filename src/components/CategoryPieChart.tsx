import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Merchant by Category</h3>
            <p className="text-sm text-slate-500">Distribution Analysis</p>
          </div>
        </div>
      </div>
      
      {/* Pie Chart */}
      <div className="flex-1 min-h-[180px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              formatter={(value: number) => `${value} merchants (${((value / total) * 100).toFixed(1)}%)`}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{total}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>

      {/* Legend Grid - 4 columns, very compact */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-1.5 mt-3 pt-3 border-t border-slate-100">
        {data.map((item, idx) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div 
              key={idx} 
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-700 truncate leading-tight">{item.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{item.value} <span className="text-[9px]">({percentage}%)</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPieChart;
