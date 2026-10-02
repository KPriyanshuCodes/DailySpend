import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
  size = 20,
  color,
}) => {
  // Try exact match or fallback to ShoppingCart
  const iconRecord = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number; color?: string }>>;
  const IconComponent = iconRecord[name] || LucideIcons.ShoppingCart;

  return <IconComponent className={className} size={size} color={color} />;
};
