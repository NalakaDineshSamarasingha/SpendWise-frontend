import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  SectionList,
} from 'react-native';
import { AddTransactionModal, NewTransaction } from '../../components/transactions/AddTransactionModal';
import type { Category as UICategory } from '../../components/transactions/CategorySelector';
import { FilterModal, Filters } from '../../components/transactions/FilterModal';
import { TransactionItem, UITransaction } from '../../components/transactions/TransactionItem';
import { createTransaction, getTransactions, TransactionDTO } from '../../services/transactionsService';
import { categories } from '../../utils/categoryUtils';
import { styles } from '../../styles/transaction';

type Category = UICategory;

const ExpenseTrackerApp = () => {
  const [selectedMonth] = useState('Month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    sortBy: 'newest',
    categories: []
  });
  const [transactions, setTransactions] = useState<UITransaction[]>([]);

  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: 'expense',
    category: '',
    description: '',
    amount: '',
    time: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  });

  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    categories.forEach(c => m.set(c.name, c));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const toUITransaction = useCallback(
    (dto: TransactionDTO): UITransaction => {
      const d = new Date(dto.date);
      const cat = dto.category ? categoryMap.get(dto.category) : undefined;
      return {
        _id: dto._id,
        description: dto.description,
        amount: dto.amount,
        type: dto.type,
        date: d,
        addedBy: dto.addedBy,
        category: dto.category,
        time: formatTime(d),
        icon: cat?.icon || 'cash-outline',
        color: cat?.color || '#F3F4F6',
      };
    },
    [categoryMap]
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.map(toUITransaction));
      } catch (e) {
        console.warn('Failed to load transactions:', e);
      }
    })();
  }, [toUITransaction]);

  const handleAddTransaction = async () => {
    if (!newTransaction.category || !newTransaction.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    try {
      const created = await createTransaction({
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        date: new Date().toISOString(),
        category: newTransaction.category,
      });
      const ui = toUITransaction(created);
      setTransactions([ui, ...transactions]);
    } catch (e: any) {
      console.error('Failed to create transaction:', e);
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
      return;
    }
    setNewTransaction({
      type: 'expense',
      category: '',
      description: '',
      amount: '',
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    });
    setShowAddModal(false);
  };

  const applyFilters = () => {
    let filtered = transactions;

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(t => t.category && filters.categories.includes(t.category));
    }

    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        case 'newest':
          return b.date.getTime() - a.date.getTime();
        case 'oldest':
          return a.date.getTime() - b.date.getTime();
        default:
          return 0;
      }
    });
    return filtered;
  };

  const filteredTransactions = applyFilters();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const now = new Date();
  const today = now;
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  // Build month/day sections
  const monthSections = useMemo(() => {
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTx = filteredTransactions.filter(tx =>
      tx.date.getMonth() === currentMonth && tx.date.getFullYear() === currentYear
    );

    // group by day key
    const map = new Map<string, UITransaction[]>();
    monthTx.forEach(tx => {
      const d = tx.date;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });

    const sections = Array.from(map.entries()).map(([key, list]) => {
      // sort transactions per day (newest first)
      list.sort((a, b) => b.date.getTime() - a.date.getTime());
      const dateObj = new Date(key);
      const baseLabel = dateObj.toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
      });
      const title = isSameDay(dateObj, today)
        ? `Today • ${baseLabel}`
        : isSameDay(dateObj, yesterday)
        ? `Yesterday • ${baseLabel}`
        : baseLabel;

      return {
        title,
        data: list,
        key
      };
    });

    // sort days newest first
    sections.sort((a, b) => b.key.localeCompare(a.key));
    return sections;
  }, [filteredTransactions, now, today, yesterday]);

  const resetFilters = () => {
    setFilters({
      type: 'all',
      sortBy: 'newest',
      categories: []
    });
  };

  const toggleCategory = (categoryName: string) => {
    const updatedCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter(cat => cat !== categoryName)
      : [...filters.categories, categoryName];
    setFilters({ ...filters, categories: updatedCategories });
  };

  const renderEmpty = () => (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: '#6B7280' }}>No transactions this month.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="funnel-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
            onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Expense / Income</Text>
        </TouchableOpacity>
      </View>

      {/* Financial Report Card */}
      <View style={styles.reportContainer}>
        <View style={styles.reportCard}>
          <Text style={styles.reportText}>See your financial report</Text>
          <Ionicons name="chevron-forward" size={20} color="#7C3AED" />
        </View>
      </View>

      {/* Monthly Transactions by Day */}
      <SectionList
        sections={monthSections}
        keyExtractor={item => item._id}
       renderItem={({ item }) => (
    <View style={styles.txItemWrapper}>
      <TransactionItem transaction={item} />
    </View>
  )}
        renderSectionHeader={({ section }) => (
          <View style={[styles.section]}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        categories={categories}
        onSave={handleAddTransaction}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        resetFilters={resetFilters}
        toggleCategory={toggleCategory}
      />
    </SafeAreaView>
  );
};

export default ExpenseTrackerApp;