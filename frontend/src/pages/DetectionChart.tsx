import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DetectionChartProps {
  data: Array<{
    date: string;
    authorized: number;
    denied: number;
    total: number;
  }>;
}

const DetectionChart: React.FC<DetectionChartProps> = ({ data }) => {
  // Default data if none provided
  const chartData = data?.length > 0 ? data : [
    { date: 'Jan 10', authorized: 45, denied: 3, total: 48 },
    { date: 'Jan 11', authorized: 52, denied: 5, total: 57 },
    { date: 'Jan 12', authorized: 48, denied: 2, total: 50 },
    { date: 'Jan 13', authorized: 67, denied: 8, total: 75 },
    { date: 'Jan 14', authorized: 58, denied: 4, total: 62 },
    { date: 'Jan 15', authorized: 73, denied: 6, total: 79 },
    { date: 'Jan 16', authorized: 65, denied: 3, total: 68 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <defs>
            <linearGradient id="authorizedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="deniedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="authorized" 
            stroke="#10b981" 
            fill="url(#authorizedGradient)"
            strokeWidth={2}
            name="Authorized"
          />
          <Area 
            type="monotone" 
            dataKey="denied" 
            stroke="#ef4444" 
            fill="url(#deniedGradient)"
            strokeWidth={2}
            name="Denied"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Authorized</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Denied</span>
        </div>
      </div>
    </div>
  );
};

export default DetectionChart;