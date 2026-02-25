import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { JobStatus } from '../../types';

interface StatusPillProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    const configs: Record<JobStatus, { label: string; bg: string; text: string }> = {
      draft: { label: 'Draft', bg: '#F3F4F6', text: '#6B7280' },
      posted: { label: 'Posted', bg: '#DBEAFE', text: '#1D4ED8' },
      quoting: { label: 'Quoting', bg: '#DBEAFE', text: '#1D4ED8' },
      awarded: { label: 'Awarded', bg: '#EDE9FE', text: '#6B21A8' },
      in_progress: { label: 'In Progress', bg: '#FEF3C7', text: '#92400E' },
      completed: { label: 'Completed', bg: '#D1FAE5', text: '#065F46' },
      cancelled: { label: 'Cancelled', bg: '#FEE2E2', text: '#991B1B' },
      expired: { label: 'Expired', bg: '#F3F4F6', text: '#6B7280' },
      closed: { label: 'Closed', bg: '#F3F4F6', text: '#6B7280' },
      disputed: { label: 'Disputed', bg: '#FEE2E2', text: '#991B1B' },
    };
    return configs[status] || configs.draft;
  };

  const config = getStatusConfig();
  const padding = size === 'sm' ? { paddingHorizontal: 8, paddingVertical: 4 } : { paddingHorizontal: 12, paddingVertical: 6 };
  const fontSize = size === 'sm' ? 12 : 14;

  return (
    <View style={[styles.pill, padding, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text, fontSize }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
