import colors from '@/constants/color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function BudgetProgress({ title, spent, limit }: { title: string; spent: number; limit: number }) {
  const pct = Math.min(100, Math.round((spent / Math.max(1, limit)) * 100));
  const barColor = spent > limit ? colors.accentRed : colors.accentGreen;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>${spent.toFixed(2)} / ${limit.toFixed(2)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: colors.textPrimary, fontWeight: '600' },
  amount: { color: colors.textSecondary },
  track: { height: 8, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 999 },
});
