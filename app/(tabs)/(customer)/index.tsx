import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { StatusPill } from '../../../src/components/ui/StatusPill';
import { jobsAPI } from '../../../src/api/jobs.api';
import { profilesAPI } from '../../../src/api/profiles.api';
import { FEATURED_CATEGORIES } from '../../../src/content/categories';
import type { CategoryProvider, Job } from '../../../src/types';

function normalizeProviders(providers: CategoryProvider[]): CategoryProvider[] {
  return providers.map((provider) => ({
    ...provider,
    avg_rating:
      provider.avg_rating == null
        ? null
        : typeof provider.avg_rating === 'number'
          ? provider.avg_rating
          : Number(provider.avg_rating),
    recent_reviews: provider.recent_reviews.map((review) => ({
      ...review,
      rating: typeof review.rating === 'number' ? review.rating : Number(review.rating),
    })),
  }));
}

function formatRating(value: number | string | null): string {
  if (value == null) return 'No rating';
  const normalized = typeof value === 'number' ? value : Number(value);
  return `${normalized.toFixed(1)}/10`;
}

function formatReviewDate(value: string): string {
  return new Date(value).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CustomerHomeScreen() {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState(FEATURED_CATEGORIES[0].id);

  const selectedCategory = useMemo(
    () => FEATURED_CATEGORIES.find((category) => category.id === selectedCategoryId) ?? FEATURED_CATEGORIES[0],
    [selectedCategoryId]
  );

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['myJobs'],
    queryFn: () => jobsAPI.getMyJobs(),
  });

  const {
    data: providerData,
    isLoading: isLoadingProviders,
    error: providersError,
  } = useQuery({
    queryKey: ['categoryProviders', selectedCategory.slug],
    queryFn: async () => {
      const response = await profilesAPI.listProvidersByCategory(selectedCategory.slug);
      return normalizeProviders(response.providers);
    },
  });

  const handleCreateJob = () => {
    router.push('/(tabs)/(customer)/post-job');
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
          <View>
            <Button
              variant="primary"
              fullWidth
              onPress={handleCreateJob}
              leftIcon="add"
              style={styles.createButton}
            >
              Post a New Job
            </Button>
            <View style={styles.categoryIntro}>
              <Text style={styles.categoryIntroTitle}>Popular job types</Text>
              <Text style={styles.categoryIntroText}>
                Tap a category to browse available contractors and recent customer reviews before you post.
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
              style={styles.categoryScroller}
            >
              {FEATURED_CATEGORIES.map((category) => {
                const isSelected = category.id === selectedCategory.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedCategoryId(category.id)}
                  >
                    <Text style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected]}>
                      {category.icon}
                    </Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryCopy} numberOfLines={3}>
                      {category.short}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.directoryCard}>
              <View style={styles.directoryHeader}>
                <View style={styles.directoryHeaderCopy}>
                  <Text style={styles.directoryEyebrow}>{selectedCategory.name}</Text>
                  <Text style={styles.directoryTitle}>Available contractors</Text>
                  <Text style={styles.directoryText}>{selectedCategory.detail}</Text>
                </View>
                <Button variant="outline" onPress={handleCreateJob} style={styles.directoryButton}>
                  Post {selectedCategory.name} Job
                </Button>
              </View>

              {isLoadingProviders ? (
                <View style={styles.directoryMessage}>
                  <Text style={styles.directoryMessageText}>
                    Loading {selectedCategory.name.toLowerCase()} contractors...
                  </Text>
                </View>
              ) : null}

              {!isLoadingProviders && providersError ? (
                <View style={[styles.directoryMessage, styles.directoryError]}>
                  <Text style={[styles.directoryMessageText, styles.directoryErrorText]}>
                    Unable to load contractors right now.
                  </Text>
                </View>
              ) : null}

              {!isLoadingProviders && !providersError && (providerData?.length ?? 0) === 0 ? (
                <View style={styles.directoryMessage}>
                  <Text style={styles.directoryMessageText}>
                    No contractors are listed for this category yet.
                  </Text>
                </View>
              ) : null}

              {!isLoadingProviders && !providersError && (providerData?.length ?? 0) > 0 ? (
                <View style={styles.providerList}>
                  {providerData?.map((provider) => (
                    <View key={provider.user_id} style={styles.providerCard}>
                      <View style={styles.providerHeader}>
                        <View style={styles.providerHeaderCopy}>
                          <Text style={styles.providerAvailability}>
                            {provider.available ? 'Available now' : 'Currently busy'}
                          </Text>
                          <Text style={styles.providerBusiness}>
                            {provider.business_name || provider.display_name || provider.full_name}
                          </Text>
                          <Text style={styles.providerName}>
                            {provider.display_name || provider.full_name}
                          </Text>
                        </View>
                        <View style={styles.providerRatingCard}>
                          <Text style={styles.providerRatingLabel}>Average rating</Text>
                          <Text style={styles.providerRatingValue}>{formatRating(provider.avg_rating)}</Text>
                          <Text style={styles.providerRatingMeta}>
                            {provider.total_reviews} reviews, {provider.jobs_completed} jobs
                          </Text>
                        </View>
                      </View>

                      <View style={styles.providerTags}>
                        {provider.years_experience != null ? (
                          <Text style={styles.providerTag}>
                            {provider.years_experience}+ years
                          </Text>
                        ) : null}
                        {provider.categories.map((category) => (
                          <Text key={category} style={styles.providerTag}>
                            {category}
                          </Text>
                        ))}
                      </View>

                      {provider.bio ? (
                        <Text style={styles.providerBio}>{provider.bio}</Text>
                      ) : null}

                      <Text style={styles.reviewHeading}>User submitted reviews</Text>
                      {provider.recent_reviews.length === 0 ? (
                        <View style={styles.reviewCard}>
                          <Text style={styles.reviewBody}>No reviews submitted yet.</Text>
                        </View>
                      ) : (
                        provider.recent_reviews.map((review) => (
                          <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                              <Text style={styles.reviewAuthor}>{review.reviewer_name}</Text>
                              <Text style={styles.reviewRating}>{review.rating}/10</Text>
                            </View>
                            <Text style={styles.reviewBody}>
                              {review.body || 'No written review provided.'}
                            </Text>
                            <Text style={styles.reviewDate}>{formatReviewDate(review.created_at)}</Text>
                          </View>
                        ))
                      )}
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
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
    paddingBottom: 28,
  },
  createButton: {
    marginBottom: 16,
  },
  categoryIntro: {
    marginBottom: 12,
  },
  categoryIntroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  categoryIntroText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  categoryScroller: {
    marginBottom: 18,
  },
  categoryRow: {
    gap: 12,
    paddingRight: 4,
  },
  categoryCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  categoryCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  categoryBadge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 10,
  },
  categoryBadgeSelected: {
    color: '#1D4ED8',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  categoryCopy: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  directoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 18,
  },
  directoryHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
    marginBottom: 16,
    gap: 12,
  },
  directoryHeaderCopy: {
    gap: 6,
  },
  directoryEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#2563EB',
  },
  directoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  directoryText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#4B5563',
  },
  directoryButton: {
    alignSelf: 'flex-start',
  },
  directoryMessage: {
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  directoryMessageText: {
    fontSize: 14,
    color: '#6B7280',
  },
  directoryError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  directoryErrorText: {
    color: '#B91C1C',
  },
  providerList: {
    gap: 14,
  },
  providerCard: {
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  providerHeader: {
    gap: 12,
  },
  providerHeaderCopy: {
    gap: 4,
  },
  providerAvailability: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#2563EB',
  },
  providerBusiness: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  providerName: {
    fontSize: 13,
    color: '#6B7280',
  },
  providerRatingCard: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  providerRatingLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  providerRatingValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  providerRatingMeta: {
    fontSize: 11,
    color: '#6B7280',
  },
  providerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  providerTag: {
    fontSize: 12,
    color: '#4B5563',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  providerBio: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    color: '#4B5563',
  },
  reviewHeading: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  reviewCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviewRating: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  reviewBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
  },
  reviewDate: {
    marginTop: 8,
    fontSize: 11,
    color: '#9CA3AF',
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
