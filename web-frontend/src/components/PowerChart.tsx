import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PowerChartProps {
  data: Array<{
    time: number;
    bess: number;
    genset: number;
    pv: number;
    load: number;
  }>;
  title: string;
}

const PowerChart: React.FC<PowerChartProps> = ({ data, title }) => {
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
            label={{ value: 'Puissance (kW)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line 
            type="linear" 
            dataKey="bess" 
            stroke="#007bff" 
            strokeWidth={2}
            name="BESS"
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line 
            type="linear" 
            dataKey="genset" 
            stroke="#28a745" 
            strokeWidth={2}
            name="Genset"
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line 
            type="linear" 
            dataKey="pv" 
            stroke="#ffc107" 
            strokeWidth={2}
            name="PV"
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line 
            type="linear" 
            dataKey="load" 
            stroke="#dc3545" 
            strokeWidth={2}
            name="Load"
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerChart;
