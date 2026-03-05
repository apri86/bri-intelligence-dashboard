import React from 'react';
import { Filter, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

interface FunnelStage {
  name: string;
  value: number;
  color: string;
}

interface AcquisitionFunnelProps {
  data: FunnelStage[];
}

const AcquisitionFunnel: React.FC<AcquisitionFunnelProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Acquisition Funnel</h3>
            <p className="text-sm text-slate-500">Conversion Pipeline</p>
          </div>
        </div>
      </div>
      
      {/* Compact Funnel Visualization */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full flex items-center justify-between gap-2">
          {data.map((stage, idx) => {
            const conversionRate = idx > 0 ? ((stage.value / data[idx - 1].value) * 100).toFixed(0) : 100;
            
            return (
              <React.Fragment key={idx}>
                <div className="flex-1 flex flex-col items-center gap-2">
                  {/* Stage Box */}
                  <div 
                    className="w-full rounded-xl p-3 text-center transition-all hover:scale-105"
                    style={{ backgroundColor: stage.color }}
                  >
                    <p className="text-white font-bold text-2xl mb-1">{stage.value}</p>
                    <p className="text-white/90 text-xs font-semibold uppercase tracking-wide">
                      {stage.name}
                    </p>
                  </div>
                  
                  {/* Conversion Rate */}
                  {idx > 0 && (
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-600">{conversionRate}%</p>
                    </div>
                  )}
                </div>
                
                {/* Arrow */}
                {idx < data.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
        <div className="text-center p-2.5 bg-emerald-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Success Rate</p>
          </div>
          <p className="text-xl font-bold text-emerald-700">
            {((data[data.length - 1].value / data[0].value) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-2.5 bg-red-50 rounded-xl">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Drop-off</p>
          </div>
          <p className="text-xl font-bold text-red-700">
            {data[0].value - data[data.length - 1].value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionFunnel;
