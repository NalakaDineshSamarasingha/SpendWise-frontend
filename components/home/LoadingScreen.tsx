// components/home/LoadingScreen.tsx
import colors from '@/constants/color';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

export default function LoadingScreen() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 300], // widened sweep for broader layouts
  });

  const Skeleton: React.FC<{ style?: any }> = ({ style }) => (
    <View style={[styles.skeletonBase, style]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.shimmer, { transform: [{ translateX }] }]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.skeletonContent}>
          {/* Header */}
          <View style={styles.rowBetween}>
            <Skeleton style={{ height: 24, width: 160 }} />
            <Skeleton style={{ height: 44, width: 44, borderRadius: 22 }} />
          </View>

            {/* Summary cards */}
          <View style={styles.cardRow}>
            <Skeleton style={styles.summaryCard} />
            <Skeleton style={styles.summaryCard} />
            <Skeleton style={styles.summaryCard} />
          </View>

          {/* Chart */}
          <Skeleton style={styles.chartPlaceholder} />

          {/* Budget Overview Section */}
          <View style={styles.sectionHeaderRow}>
            <Skeleton style={{ height: 20, width: 160 }} />
            <Skeleton style={{ height: 16, width: 60 }} />
          </View>
          {[0,1,2].map(i => (
            <View key={'budget-'+i} style={styles.progressBarContainer}>
              <Skeleton style={{ height: 12, width: '82%', borderRadius: 8, marginBottom: 8 }} />
              <Skeleton style={styles.progressBar} />
            </View>
          ))}

          {/* Categories grid */}
          <View style={styles.sectionHeaderRow}>
            <Skeleton style={{ height: 20, width: 140 }} />
            <Skeleton style={{ height: 16, width: 80 }} />
          </View>
          <View style={styles.categoriesGrid}>
            {[0,1,2,3,4,5].map(i => (
              <View key={'cat-'+i} style={styles.categoryCard}>
                <Skeleton style={{ height: 34, width: 34, borderRadius: 17, marginBottom: 10 }} />
                <Skeleton style={{ height: 10, width: '70%', borderRadius: 6 }} />
              </View>
            ))}
          </View>

          {/* Transactions Section Header */}
          <View style={styles.rowBetween}>
            <Skeleton style={{ height: 20, width: 170 }} />
            <Skeleton style={{ height: 16, width: 70 }} />
          </View>

          {/* Transaction list items */}
          {[0,1,2,3,4,5].map(i => (
            <View key={i} style={styles.listItem}>
              <Skeleton style={styles.listIcon} />
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Skeleton style={{ height: 14, width: '68%', marginBottom: 8 }} />
                <Skeleton style={{ height: 12, width: '42%' }} />
              </View>
              <Skeleton style={{ height: 14, width: 52 }} />
            </View>
          ))}

          {/* Spacer for bottom bar overlap */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ...existing code...
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 56,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.textDisabled,
    fontWeight: '500',
  },
  // removed old skeletonGroup / skeletonBlock usage, replaced:
  skeletonContent: {
    // ...existing code...
    marginTop: 12,
    width: '90%',
  },
  skeletonBase: {
    // ...existing code...
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shimmer: {
    // ...existing code...
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    borderRadius: 12,
    backgroundColor: colors.border,
    opacity: 0.9,
  },
  rowBetween: {
    // ...existing code...
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  cardRow: {
    // ...existing code...
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  summaryCard: {
    // ...existing code...
    height: 90,
    width: '31%',
    borderRadius: 16,
  },
  chartPlaceholder: {
    // ...existing code...
    height: 150,
    width: '100%',
    borderRadius: 20,
    marginBottom: 32,
  },
  progressBarContainer: {
    marginBottom: 18,
  },
  progressBar: {
    height: 12,
    width: '100%',
    borderRadius: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: colors.background,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'hidden',
  },
  listItem: {
    // ...existing code...
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  listIcon: {
    // ...existing code...
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  tabBar: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    backgroundColor: colors.background,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabItem: {
    width: 56,
    alignItems: 'center',
  },
});
