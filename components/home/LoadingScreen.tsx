// components/home/LoadingScreen.tsx
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';

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
    outputRange: [-60, 260], // wide enough to sweep across
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
      {/* Top static indicator + text (kept) */}
      <ActivityIndicator size="large" color="#8B5CF6" />

      {/* Structured mimic of home dashboard */}
      <View style={styles.skeletonContent}>
        {/* Header: title + avatar */}
        <View style={styles.rowBetween}>
          <Skeleton style={{ height: 24, width: 160 }} />
          <Skeleton style={{ height: 40, width: 40, borderRadius: 20 }} />
        </View>

        {/* Summary cards row */}
        <View style={styles.cardRow}>
          <Skeleton style={styles.summaryCard} />
          <Skeleton style={styles.summaryCard} />
          <Skeleton style={styles.summaryCard} />
        </View>

        {/* Chart area */}
        <Skeleton style={styles.chartPlaceholder} />

        {/* Section header (e.g., Recent Transactions) */}
        <View style={styles.rowBetween}>
          <Skeleton style={{ height: 20, width: 140 }} />
          <Skeleton style={{ height: 16, width: 70 }} />
        </View>

        {/* Transaction list items */}
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={styles.listItem}>
            <Skeleton style={styles.listIcon} />
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Skeleton style={{ height: 14, width: '70%', marginBottom: 8 }} />
              <Skeleton style={{ height: 12, width: '40%' }} />
            </View>
            <Skeleton style={{ height: 14, width: 50 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // modified: top-aligned layout
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  // removed old skeletonGroup / skeletonBlock usage, replaced:
  skeletonContent: {
    marginTop: 28,
    width: '90%',
  },
  skeletonBase: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  shimmer: {
    // ...existing code...
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    opacity: 0.9,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  summaryCard: {
    height: 90,
    width: '31%',
    borderRadius: 16,
  },
  chartPlaceholder: {
    height: 140,
    width: '100%',
    borderRadius: 18,
    marginBottom: 28,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  listIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
});
