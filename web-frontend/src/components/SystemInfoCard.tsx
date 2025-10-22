import React from 'react';

interface SystemInfoCardProps {
  title: string;
  line1: string;
  line2?: string;
  icon?: string;
}

const SystemInfoCard: React.FC<SystemInfoCardProps> = ({ 
  title, 
  line1, 
  line2 = '', 
  icon 
}) => {
  return (
    <div className="card p-5 text-center">
      <div className="flex items-center justify-center mb-3">
        {icon && <span className="text-2xl mr-2">{icon}</span>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-700 mb-1" dangerouslySetInnerHTML={{ __html: line1 }} />
      {line2 && <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: line2 }} />}
    </div>
  );
};

export default SystemInfoCard;
