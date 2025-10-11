import AddBudgetModal from '@/components/budget/AddBudgetModal';
import BudgetList from '@/components/budget/BudgetList';
import colors from '@/constants/color';
import { Fonts } from '@/constants/theme';
import { Budget, createBudget, deleteBudget, listBudgets } from '@/services/budgetService';
import { TransactionDTO, getTransactions } from '@/services/transactionsService';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [txns, setTxns] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  async function handleCreate(input: Parameters<typeof createBudget>[0]) {
    await createBudget(input);
    setModalOpen(false);
    await load();
  }

  async function handleDelete(id: string) {
    await deleteBudget(id);
    await load();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Budgets</Text>
        <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.addBtn}>
          <Text style={styles.addText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <BudgetList budgets={budgets} transactions={txns} onDelete={handleDelete} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#fff" />} />

      <AddBudgetModal visible={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background,paddingTop: 40 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  title: { color: '#fff', fontSize: 20, fontFamily: Fonts.rounded, fontWeight: '700' },
  addBtn: { backgroundColor: colors.accentBlue, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: '700' },
});