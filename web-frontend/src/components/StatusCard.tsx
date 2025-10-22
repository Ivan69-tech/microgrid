import React from 'react';

interface StatusCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  subtitle = '', 
  icon,
  className = '' 
}) => {
  return (
    <div className={`card p-6 text-center min-h-[180px] flex flex-col justify-center ${className}`}>
      <div className="flex items-center justify-center mb-4">
        {icon && <span className="text-3xl mr-2">{icon}</span>}
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div 
        className="text-2xl font-bold text-primary mb-2"
        dangerouslySetInnerHTML={{ __html: value }}
      />
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default StatusCard;
