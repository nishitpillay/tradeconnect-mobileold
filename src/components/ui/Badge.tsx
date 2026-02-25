import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  type: 'verification' | 'urgency' | 'count';
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  icon?: keyof typeof Ionicons.glyphMap;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', icon }) => {
  const getVariantColors = () => {
    const variants = {
      success: { bg: '#D1FAE5', text: '#065F46', icon: '#10B981' },
      warning: { bg: '#FEF3C7', text: '#92400E', icon: '#F59E0B' },
      error: { bg: '#FEE2E2', text: '#991B1B', icon: '#EF4444' },
      info: { bg: '#DBEAFE', text: '#1E40AF', icon: '#3B82F6' },
      neutral: { bg: '#F3F4F6', text: '#6B7280', icon: '#9CA3AF' },
    };
    return variants[variant];
  };

  const colors = getVariantColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      {icon && <Ionicons name={icon} size={14} color={colors.icon} style={{ marginRight: 4 }} />}
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
