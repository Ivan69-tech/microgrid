import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SOCChartProps {
  data: Array<{
    time: number;
    soc: number;
  }>;
  title: string;
}

const SOCChart: React.FC<SOCChartProps> = ({ data, title }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#334155"
            fontSize={12}
          />
          <YAxis 
            stroke="#334155"
            fontSize={12}
            label={{ value: 'SOC (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="linear" 
            dataKey="soc" 
            stroke="#210fc5" 
            strokeWidth={2}
            name="BESS SOC"
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SOCChart;
