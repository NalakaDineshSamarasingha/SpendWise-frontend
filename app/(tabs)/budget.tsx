import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type BudgetItem = {
  id: string;
  name: string;
  category: keyof typeof CATEGORY_META;
  amount: number; // positive number in base currency
  dueDate: string; // ISO date
  frequency: 'monthly' | 'weekly' | 'yearly' | 'once';
};

const CATEGORY_META = {
  Bills: { icon: 'receipt', color: '#EF4444' },
  Subscriptions: { icon: 'repeat', color: '#8B5CF6' },
  Groceries: { icon: 'shopping-cart', color: '#10B981' },
  Transport: { icon: 'directions-car', color: '#3B82F6' },
  Rent: { icon: 'home', color: '#F59E0B' },
  Entertainment: { icon: 'music-note', color: '#EC4899' },
  Other: { icon: 'account-balance-wallet', color: '#6B7280' },
} as const;

const MOCK_UPCOMING: BudgetItem[] = [
  { id: '1', name: 'Apartment Rent', category: 'Rent', amount: 1200, dueDate: nextDateOfMonth(1), frequency: 'monthly' },
  { id: '2', name: 'Internet', category: 'Bills', amount: 60, dueDate: addDays(new Date(), 3).toISOString(), frequency: 'monthly' },
  { id: '3', name: 'Spotify', category: 'Subscriptions', amount: 9.99, dueDate: addDays(new Date(), 6).toISOString(), frequency: 'monthly' },
  { id: '4', name: 'Groceries (plan)', category: 'Groceries', amount: 200, dueDate: addDays(new Date(), 8).toISOString(), frequency: 'weekly' },
  { id: '5', name: 'Metro Card', category: 'Transport', amount: 40, dueDate: addDays(new Date(), 12).toISOString(), frequency: 'monthly' },
  { id: '6', name: 'Movie Night', category: 'Entertainment', amount: 30, dueDate: addDays(new Date(), 15).toISOString(), frequency: 'once' },
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function nextDateOfMonth(day: number) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), day);
  if (target < now) target.setMonth(target.getMonth() + 1);
  return target.toISOString();
}

function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function formatDue(dateISO: string) {
  const now = new Date();
  const due = new Date(dateISO);
  const ms = due.getTime() - now.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  const short = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (days < 0) return `Overdue (${short})`;
  if (days === 0) return `Due today (${short})`;
  if (days === 1) return `Due tomorrow (${short})`;
  return `Due in ${days} days (${short})`;
}

export default function BudgetScreen() {
  const upcoming = useMemo(() => {
    const now = new Date();
    const in30 = addDays(now, 30).getTime();
    return [...MOCK_UPCOMING]
      .filter((i) => new Date(i.dueDate).getTime() <= in30)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, []);

  const total = useMemo(() => upcoming.reduce((sum, i) => sum + i.amount, 0), [upcoming]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name="donut-large" size={32} color="#8B5CF6" />
        <ThemedText type="title" style={styles.headerTitle}>Upcoming</ThemedText>
      </View>

      <View style={styles.summaryCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconSymbol name="calendar-today" size={20} color="#6B7280" />
          <ThemedText style={styles.summaryLabel}>Next 30 days</ThemedText>
        </View>
        <ThemedText type="defaultSemiBold" style={styles.summaryValue}>{formatCurrency(total)}</ThemedText>
      </View>

      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const meta = CATEGORY_META[item.category] ?? CATEGORY_META.Other;
          return (
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: withOpacity(meta.color, 0.12) }]}>
                <IconSymbol name={meta.icon} size={18} color={meta.color} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText type="defaultSemiBold" style={styles.rowTitle}>{item.name}</ThemedText>
                <ThemedText style={styles.rowSub}>{formatDue(item.dueDate)} • {item.frequency}</ThemedText>
              </View>
              <ThemedText type="defaultSemiBold" style={{ color: meta.color }}>{formatCurrency(item.amount)}</ThemedText>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <IconSymbol name="inbox" size={40} color="#9CA3AF" />
            <ThemedText style={styles.helper}>No upcoming items</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  headerTitle: { fontFamily: Fonts.rounded },
  summaryCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { color: '#6B7280' },
  summaryValue: { fontSize: 18 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB', marginLeft: 52 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { marginBottom: 2 },
  rowSub: { color: '#6B7280', fontSize: 12 },
  helper: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginTop: 6 },
});

function withOpacity(hex: string, opacity: number) {
  // Accept #RRGGBB
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
