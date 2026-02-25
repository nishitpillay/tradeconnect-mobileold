import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { StatusPill } from '../../../src/components/ui/StatusPill';
import { jobsAPI } from '../../../src/api/jobs.api';
import type { Job } from '../../../src/types';

export default function CustomerHomeScreen() {
  const router = useRouter();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['myJobs'],
    queryFn: () => jobsAPI.getMyJobs(),
  });

  const handleCreateJob = () => {
    router.push('/(tabs)/(customer)/post-job/step-1');
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <Card onPress={() => router.push(`/(tabs)/(customer)/jobs/${item.id}`)} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
        <StatusPill status={item.status} size="sm" />
      </View>
      <Text style={styles.jobSuburb}>{item.suburb}, {item.state}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.quoteCount}>{item.quote_count} quotes</Text>
        <Text style={styles.jobDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No jobs yet</Text>
      <Text style={styles.emptyText}>
        Post your first job to get quotes from trusted tradies
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.jobs || []}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Button
            variant="primary"
            fullWidth
            onPress={handleCreateJob}
            leftIcon="add"
            style={styles.createButton}
          >
            Post a New Job
          </Button>
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  list: {
    padding: 16,
  },
  createButton: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  jobSuburb: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteCount: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  jobDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
