import React from 'react';
import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import type { JobStatus } from '../../types';

const pillVariants = cva('self-start rounded-xl', {
  variants: {
    status: {
      draft: 'bg-gray-100',
      posted: 'bg-blue-100',
      quoting: 'bg-blue-100',
      awarded: 'bg-violet-100',
      in_progress: 'bg-amber-100',
      completed: 'bg-green-100',
      cancelled: 'bg-red-100',
      expired: 'bg-gray-100',
      closed: 'bg-gray-100',
      disputed: 'bg-red-100',
    },
    size: {
      sm: 'px-2 py-1',
      md: 'px-3 py-1.5',
    },
  },
  defaultVariants: {
    status: 'draft',
    size: 'md',
  },
});

const pillTextVariants = cva('font-semibold', {
  variants: {
    status: {
      draft: 'text-gray-700',
      posted: 'text-blue-700',
      quoting: 'text-blue-700',
      awarded: 'text-violet-800',
      in_progress: 'text-amber-800',
      completed: 'text-green-800',
      cancelled: 'text-red-800',
      expired: 'text-gray-700',
      closed: 'text-gray-700',
      disputed: 'text-red-800',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: {
    status: 'draft',
    size: 'md',
  },
});

const statusLabels: Record<JobStatus, string> = {
  draft: 'Draft',
  posted: 'Posted',
  quoting: 'Quoting',
  awarded: 'Awarded',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'Expired',
  closed: 'Closed',
  disputed: 'Disputed',
};

interface StatusPillProps extends VariantProps<typeof pillVariants> {
  status: JobStatus;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size, className }) => {
  const label = statusLabels[status] || 'Unknown';

  return (
    <View className={pillVariants({ status, size, className })}>
      <Text className={pillTextVariants({ status, size })}>{label}</Text>
    </View>
  );
};
