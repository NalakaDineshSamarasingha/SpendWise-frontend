import AddBudgetModal from '@/components/budget/AddBudgetModal';
import BudgetList from '@/components/budget/BudgetList';
import BudgetSummary from '@/components/budget/BudgetSummary';
import colors from '@/constants/color';
import { Fonts } from '@/constants/theme';
import { Budget, createBudget, deleteBudget, listBudgets, parseBudgetEndMs, updateBudget } from '@/services/budgetService';
import { TransactionDTO, getTransactions } from '@/services/transactionsService';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [txns, setTxns] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'ongoing' | 'completed'>('ongoing');
  const hasOngoing = filterBudgets(budgets, 'ongoing').length > 0;
  const [editing, setEditing] = useState<Budget | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, t] = await Promise.all([
        listBudgets(),
        getTransactions().catch(() => [] as TransactionDTO[]),
      ]);
      setBudgets(b);
      setTxns(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(input: Parameters<typeof createBudget>[0]) {
    if (editing) {
      await updateBudget(editing.id, input);
      setModalOpen(false);
      setEditing(null);
      await load();
      return;
    }
    await createBudget(input);
    setModalOpen(false);
    await load();
  }

  async function handleDelete(id: string) {
    await deleteBudget(id);
    await load();
  }

  function openEdit(budget: Budget) {
    setEditing(budget);
    setModalOpen(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Budgets</Text>
        {!hasOngoing && (
          <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.addBtn}>
            <Text style={styles.addText}>+ New</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => setTab('ongoing')} style={[styles.tabBtn, tab === 'ongoing' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'ongoing' && styles.tabTextActive]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('completed')} style={[styles.tabBtn, tab === 'completed' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'completed' && styles.tabTextActive]}>Completed</Text>
        </TouchableOpacity>
      </View>

      {tab === 'ongoing' ? (
        <BudgetList
          budgets={filterBudgets(budgets, 'ongoing')}
          transactions={txns}
          onDelete={handleDelete}
          onEdit={openEdit}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#fff" />}
          emptyTitle={'No ongoing budgets'}
          emptySub={'Create a budget to track your spending.'}
          hideItems
          headerComponent={filterBudgets(budgets, 'ongoing')[0] ? (
            <View style={{ paddingBottom: 8 }}>
              <BudgetSummary budget={filterBudgets(budgets, 'ongoing')[0]} transactions={txns} onEdit={openEdit} onDelete={handleDelete} />
            </View>
          ) : null}
        />
      ) : (
        <BudgetList
          budgets={filterBudgets(budgets, 'completed')}
          transactions={txns}
          onDelete={handleDelete}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#fff" />}
          emptyTitle={'No completed budgets'}
          emptySub={'Finished budgets will appear here.'}
        />
      )}

      <AddBudgetModal
        visible={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initial={editing ? {
          name: editing.name,
          timeframe: editing.timeframe,
          startDate: editing.startDate || '',
          endDate: editing.endDate || '',
          categories: editing.categories,
        } : undefined}
        submitLabel={editing ? 'Save' : 'Create'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background,paddingTop: 40 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  title: { color: '#fff', fontSize: 20, fontFamily: Fonts.rounded, fontWeight: '700' },
  addBtn: { backgroundColor: colors.accentBlue, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: '700' },
  tabsRow: { flexDirection: 'row',borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: 16, padding: 0, borderRadius: 10, marginBottom: 8 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8},
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: colors.accentBlue },
  tabText: { color: colors.textSecondary, fontWeight: '700' },
  tabTextActive: { color: '#fff' },
});

function filterBudgets(budgets: Budget[], tab: 'ongoing' | 'completed'): Budget[] {
  const now = Date.now();
  if (tab === 'completed') {
    return budgets.filter(b => (b.endDate ? parseBudgetEndMs(b.endDate) < now : false));
  }
  // ongoing: not yet completed (includes active and upcoming)
  return budgets.filter(b => (b.endDate ? parseBudgetEndMs(b.endDate) >= now : true));
}