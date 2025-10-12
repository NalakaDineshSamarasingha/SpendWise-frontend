import colors from '@/constants/color';
import { Budget, parseBudgetEndMs, parseBudgetStartMs } from '@/services/budgetService';
import { TransactionDTO } from '@/services/transactionsService';
import React, { ReactNode, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BudgetProgress } from './BudgetProgress';

export default function BudgetList({
  budgets,
  transactions,
  onDelete,
  onEdit,
  refreshControl,
  emptyTitle,
  emptySub,
  headerComponent,
  hideItems,
}: {
  budgets: Budget[];
  transactions: TransactionDTO[];
  onDelete: (id: string) => void;
  onEdit?: (budget: Budget) => void;
  refreshControl?: ReactNode;
  emptyTitle?: string;
  emptySub?: string;
  headerComponent?: ReactNode;
  hideItems?: boolean;
}) {
  const items = hideItems ? [] : budgets;
  return (
    <FlatList
      style={{ flex: 1 }}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={hideItems ? undefined : (({ item }) => (
        <BudgetItem budget={item} transactions={transactions} onDelete={onDelete} onEdit={onEdit} />
      ))}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={refreshControl as any}
      ListHeaderComponent={headerComponent as any}
      ListEmptyComponent={hideItems ? undefined : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>{emptyTitle || 'No budgets yet'}</Text>
          <Text style={styles.emptySub}>{emptySub || 'Create a budget to track your spending for a timeframe.'}</Text>
        </View>
      )}
    />
  );
}

function BudgetItem({ budget, transactions, onDelete, onEdit }: { budget: Budget; transactions: TransactionDTO[]; onDelete: (id: string) => void; onEdit?: (budget: Budget) => void }) {
  const totals = useMemo(() => computeTotals(budget, transactions), [budget, transactions]);
  const range = `${formatDate(budget.startDate)} - ${formatDate(budget.endDate)}`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{budget.name}</Text>
          <Text style={styles.range}>{range}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(budget)} style={styles.actionBtn}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onDelete(budget.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {budget.categories.map(c => (
          <BudgetProgress key={c.category} title={c.category} spent={totals[c.category] || 0} limit={c.limit} />
        ))}
      </View>
    </View>
  );
}

function computeTotals(budget: Budget, transactions: TransactionDTO[]): Record<string, number> {
  const start = budget.startDate ? parseBudgetStartMs(budget.startDate) : Number.NEGATIVE_INFINITY;
  const end = budget.endDate ? parseBudgetEndMs(budget.endDate) : Number.POSITIVE_INFINITY;
  const totals: Record<string, number> = {};
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const ts = new Date(t.date).getTime();
    if (ts < start || ts > end) continue;
    const cat = (t.category || 'Uncategorized');
    totals[cat] = (totals[cat] || 0) + Math.abs(t.amount);
  }
  return totals;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  // Supports YYYY-MM-DD or full ISO
  if (!dateStr.includes('T')) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString();
  }
  return new Date(dateStr).toLocaleDateString();
}

const styles = StyleSheet.create({
  emptyBox: { padding: 24, alignItems: 'center' },
  emptyTitle: { color: colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  emptySub: { color: colors.textSecondary },
  card: { backgroundColor: colors.backgroundSecondary, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: colors.textPrimary, fontWeight: '700', fontSize: 16 },
  range: { color: colors.textSecondary, fontSize: 12 },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: 8 },
  deleteText: { color: colors.accentRed, fontWeight: '700' },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: 8, marginRight: 8 },
  actionText: { color: colors.textPrimary, fontWeight: '700' },
});

export { computeTotals };

