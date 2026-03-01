import React from 'react';
import { View, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

const cardClasses = 'bg-white rounded-xl p-4 shadow-sm';

export const Card: React.FC<CardProps> = ({ children, onPress, className = '' }) => {
  const combinedClasses = `${cardClasses} ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        className={combinedClasses}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={combinedClasses}>{children}</View>;
};
