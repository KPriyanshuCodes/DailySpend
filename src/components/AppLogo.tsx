import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number | string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xs border border-stone-200/60 bg-[#FBF9F5] flex items-center justify-center shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <img
        src="/src/assets/images/app_logo_1790967402200.jpg"
        alt="DailySpend Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover scale-105"
      />
    </div>
  );
};
