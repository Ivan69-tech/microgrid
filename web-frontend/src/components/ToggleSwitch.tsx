import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  help?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  checked, 
  onChange, 
  disabled = false,
  help 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {help && (
          <p className="text-xs text-gray-500 mt-1">{help}</p>
        )}
      </div>
      <button
        type="button"
        className={`toggle ${checked ? 'toggle-checked' : 'toggle-unchecked'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span
          className={`toggle-thumb ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
