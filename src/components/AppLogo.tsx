import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number | string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xs border border-stone-800 bg-stone-950 flex items-center justify-center shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <img
        src="/src/assets/images/flow_logo_1791016165796.jpg"
        alt="flow logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover scale-100"
      />
    </div>
  );
};
