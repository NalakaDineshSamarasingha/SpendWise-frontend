import colors from '@/constants/color';
import { Fonts } from '@/constants/theme';
import { Budget, parseBudgetEndMs, parseBudgetStartMs } from '@/services/budgetService';
import { TransactionDTO } from '@/services/transactionsService';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BudgetSummary({ budget, transactions, onEdit, onDelete }: { budget: Budget; transactions: TransactionDTO[]; onEdit?: (budget: Budget) => void; onDelete?: (id: string) => void }) {
  const computed = useMemo(() => computeBudgetStats(budget, transactions), [budget, transactions]);
  const { totalLimit, remaining, pctSpent, daysLeft, perDay, perCategory, startLabel, endLabel, todayPct } = computed;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16, fontFamily: Fonts.rounded, fontWeight: '700' }}>{budget.name}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onEdit && (
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} onPress={() => onEdit(budget)} style={{ marginRight: 14 }} />
          )}
          {onDelete && (
            <Ionicons name="trash-outline" size={18} color={colors.accentRed} onPress={() => onDelete(budget.id)} />
          )}
        </View>
      </View>
      <View style={styles.totalBox}>
        <Text style={styles.totalLeft}>Rs. {formatNumber(remaining)}</Text>
        <Text style={styles.totalSub}>left out of Rs. {formatNumber(totalLimit)}</Text>
      </View>

      <View style={styles.overallBar}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pctSpent}%` }]} />
        </View>
        {/* Today marker */}
        <View style={[styles.todayMarker, { left: `${todayPct}%` }]}> 
          <View style={styles.todayDot} />
          <Text style={styles.todayLabel}>Today</Text>
        </View>
        <View style={styles.barDatesRow}>
          <Text style={styles.dateText}>{startLabel}</Text>
          <Text style={styles.dateText}>{endLabel}</Text>
        </View>
      </View>

      <View style={styles.hintBox}>
        {daysLeft > 0 ? (
          <Text style={styles.hintText}>You can spend <Text style={{ color: colors.accentGreen, fontWeight: '700' }}>Rs. {formatNumber(perDay)}</Text> per day for the next {daysLeft} day{daysLeft !== 1 ? 's' : ''}.</Text>
        ) : (
          <Text style={styles.hintText}>This budget period has ended.</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>

      <View>
        {perCategory.map(cat => (
          <View key={cat.category} style={styles.catCard}>
            <View style={styles.catHeaderRow}>
              <View style={styles.catLeft}>
                <Ionicons name={guessIcon(cat.category)} size={22} color={colors.textPrimary} style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.catTitle}>{cat.category}</Text>
                  <Text style={styles.catSub}>{cat.remainingPct}% remaining</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.catAmount, { color: cat.spent > cat.limit ? colors.accentRed : colors.textPrimary }]}>Rs. {formatNumber(cat.spent)}</Text>
                <Text style={styles.catSub}>of Rs. {formatNumber(cat.limit)}</Text>
              </View>
            </View>
            <View style={styles.catTrack}> 
              <View style={[styles.catFill, { width: `${cat.pctSpent}%`, backgroundColor: cat.spent > cat.limit ? colors.accentRed : colors.accentGreen }]} />
            </View>
            <Text style={[styles.catPerDay, { color: cat.spent > cat.limit ? colors.accentRed : colors.accentGreen }]}>Rs. {formatNumber(cat.perDay)} / day for {daysLeft} days.</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function computeBudgetStats(budget: Budget, txns: TransactionDTO[]) {
  const startMs = budget.startDate ? parseBudgetStartMs(budget.startDate) : Number.NEGATIVE_INFINITY;
  const endMs = budget.endDate ? parseBudgetEndMs(budget.endDate) : Number.POSITIVE_INFINITY;
  const now = Date.now();
  const clampedNow = Math.max(startMs, Math.min(now, endMs));
  const todayPct = finitePercent((clampedNow - startMs) / Math.max(1, endMs - startMs));

  const categories = budget.categories || [];
  const totalLimit = categories.reduce((sum, c) => sum + (c.limit || 0), 0);

  const spentByCat: Record<string, number> = {};
  const nameMap = new Map<string, string>(categories.map(c => [c.category.toLowerCase(), c.category]));
  for (const t of txns) {
    if (t.type !== 'expense') continue;
    const ts = new Date(t.date).getTime();
    if (ts < startMs || ts > endMs) continue;
    if (!t.category) continue;
    const key = nameMap.get(t.category.toLowerCase());
    if (!key) continue; // only count configured categories
    spentByCat[key] = (spentByCat[key] || 0) + Math.abs(t.amount);
  }
  const totalSpent = categories.reduce((sum, c) => sum + (spentByCat[c.category] || 0), 0);
  const remaining = Math.max(0, totalLimit - totalSpent);
  const pctSpent = finitePercent(totalSpent / Math.max(1, totalLimit));

  const daysLeft = calcDaysLeft(endMs);
  const perDay = daysLeft > 0 ? roundTo(remaining / daysLeft, 0) : 0;

  const perCategory = categories.map(c => {
    const spent = spentByCat[c.category] || 0;
    const rem = Math.max(0, c.limit - spent);
    return {
      category: c.category,
      limit: c.limit,
      spent,
      remaining: rem,
      remainingPct: finitePercent(rem / Math.max(1, c.limit)),
      pctSpent: finitePercent(spent / Math.max(1, c.limit)),
      perDay: daysLeft > 0 ? roundTo(rem / daysLeft, 0) : 0,
    };
  });

  const startLabel = budget.startDate ? formatLongDate(budget.startDate) : '';
  const endLabel = budget.endDate ? formatLongDate(budget.endDate) : '';

  return { totalLimit, remaining, pctSpent, daysLeft, perDay, perCategory, startLabel, endLabel, todayPct };
}

function calcDaysLeft(endMs: number): number {
  if (!isFinite(endMs)) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endMs);
  end.setHours(23, 59, 59, 999);
  const ms = end.getTime() - today.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 86400000) + 1; // inclusive
}

function finitePercent(v: number): number {
  if (!isFinite(v)) return 0;
  return Math.round(Math.max(0, Math.min(1, v)) * 100);
}

function roundTo(n: number, dp: number): number {
  const p = Math.pow(10, dp);
  return Math.round(n * p) / p;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
}

function formatLongDate(dateStr: string): string {
  const hasT = dateStr.includes('T');
  const d = hasT ? new Date(dateStr) : (() => {
    const [y, m, dd] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, dd || 1);
  })();
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' } as any);
}

function guessIcon(category: string): any {
  const key = category.toLowerCase();
  if (key.includes('transport')) return 'car-outline';
  if (key.includes('health')) return 'medical-outline';
  if (key.includes('util')) return 'flash-outline';
  if (key.includes('food')) return 'restaurant-outline';
  if (key.includes('shop')) return 'bag-outline';
  if (key.includes('bill')) return 'receipt-outline';
  return 'cash-outline';
}

const styles = StyleSheet.create({
  totalBox: { alignItems: 'center', marginTop: 8, marginBottom: 8 },
  totalLeft: { color: colors.accentGreen, fontSize: 28, fontWeight: '800', fontFamily: Fonts.rounded },
  totalSub: { color: colors.textSecondary, marginTop: 4 },

  overallBar: { marginVertical: 12, position: 'relative' },
  barTrack: { height: 18, backgroundColor: colors.surface, borderRadius: 999, overflow: 'hidden' },
  barFill: { height: 18, backgroundColor: colors.accentGreen },
  barDatesRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  dateText: { color: colors.textSecondary },
  todayMarker: { position: 'absolute', top: -6 },
  todayDot: { width: 2, height: 30, backgroundColor: '#fff', borderRadius: 2 },
  todayLabel: { position: 'absolute', left: 4, top: -12, color: '#fff', fontSize: 12, backgroundColor: colors.surface, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },

  hintBox: { backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  hintText: { color: colors.textPrimary },

  sectionTitle: { color: colors.textSecondary, marginTop: 16, marginBottom: 8, fontWeight: '700' },
  catCard: { backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  catHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catLeft: { flexDirection: 'row', alignItems: 'center' },
  catTitle: { color: colors.textPrimary, fontWeight: '700' },
  catSub: { color: colors.textSecondary, fontSize: 12 },
  catAmount: { fontWeight: '700' },
  catTrack: { height: 8, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden', marginTop: 4 },
  catFill: { height: 8, borderRadius: 999 },
  catPerDay: { marginTop: 6, fontWeight: '700' },
});
