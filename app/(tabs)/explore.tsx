import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddTransactionModal, NewTransaction } from '../../components/transactions/AddTransactionModal';
import type { Category as UICategory } from '../../components/transactions/CategorySelector';
import { FilterModal, Filters } from '../../components/transactions/FilterModal';
import { TransactionItem, UITransaction } from '../../components/transactions/TransactionItem';
import { createTransaction, getTransactions, TransactionDTO } from '../../services/transactionsService';

// Add type definitions at the top
// Local UI category type alias
type Category = UICategory;

const ExpenseTrackerApp = () => {
  const [selectedMonth] = useState('Month'); // Remove setSelectedMonth if not used
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: 'all', // 'all', 'income', 'expense'
    sortBy: 'newest', // 'highest', 'lowest', 'newest', 'oldest'
    categories: [] // array of selected category names
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

  const categories: Category[] = useMemo(() => ([
    { name: 'Shopping', icon: 'bag-outline', color: '#FED7AA' },
    { name: 'Food', icon: 'restaurant-outline', color: '#FECACA' },
    { name: 'Transportation', icon: 'car-outline', color: '#BFDBFE' },
    { name: 'Subscription', icon: 'tv-outline', color: '#DDD6FE' },
    { name: 'Entertainment', icon: 'game-controller-outline', color: '#FBCFE8' },
    { name: 'Bills', icon: 'receipt-outline', color: '#FEF3C7' },
    { name: 'Health', icon: 'medical-outline', color: '#A7F3D0' },
    { name: 'Salary', icon: 'cash-outline', color: '#BBF7D0' },
  ]), []);

  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    categories.forEach(c => m.set(c.name, c));
    return m;
  }, [categories]);

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

  // Load transactions from backend
  useEffect(() => {
    (async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.map(toUITransaction));
      } catch (e) {
        console.warn('Failed to load transactions, using local sample:', e);
        // Optional: keep empty or set a small sample
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

  // remove legacy sample API code – real API is wired via services

  const applyFilters = () => {
    let filtered = transactions;

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(t => t.category && filters.categories.includes(t.category));
    }

    // Sort transactions
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredTransactions = applyFilters();
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const now = new Date();
  const today = now;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const todayTransactions = filteredTransactions.filter(t => isSameDay(new Date(t.date as any), today));
  const yesterdayTransactions = filteredTransactions.filter(t => isSameDay(new Date(t.date as any), yesterday));

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

  // Category selection is handled within AddTransactionModal

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
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="#6B7280" />
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

      {/* Transactions */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Today Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {todayTransactions.map(transaction => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))}
        </View>

        {/* Yesterday Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          {yesterdayTransactions.map(transaction => (
            <TransactionItem key={transaction._id} transaction={transaction} />
          ))}
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop:50
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginRight: 8,
  },
  addButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  reportCard: {
    backgroundColor: '#E9D5FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  expenseSelected: {
    backgroundColor: '#EF4444',
  },
  incomeSelected: {
    backgroundColor: '#10B981',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 100,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Filter Modal Styles
  filterModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '90%',
    marginTop: 'auto',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 20,
  },
  filterTypeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterTypeButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTypeSelected: {
    backgroundColor: '#8B5CF6',
  },
  filterTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTypeTextSelected: {
    color: '#FFFFFF',
  },
  sortOptionsContainer: {
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sortButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  sortButtonFull: {
    alignSelf: 'flex-start',
  },
  sortButtonSelected: {
    backgroundColor: '#111827',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sortButtonTextSelected: {
    color: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  categorySelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  categoryCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryCountText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  categoryList: {
    maxHeight: 200,
    marginBottom: 24,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  applyButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    alignSelf: 'center',
  },
});

export default ExpenseTrackerApp;