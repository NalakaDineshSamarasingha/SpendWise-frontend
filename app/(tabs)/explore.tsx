import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Add type definitions at the top
interface Transaction {
  _id?: string; // MongoDB ObjectId (optional for new transactions)
  description: string;
  amount: number;
  type: 'expense' | 'income';
  date: Date | string;
  addedBy: string; // User ObjectId
  category?: string; // Optional as per schema
  // UI-only properties (not sent to backend)
  time?: string;
  icon?: string;
  color?: string;
}

interface Category {
  name: string;
  icon: string;
  color: string;
}

interface NewTransaction {
  type: 'expense' | 'income';
  category: string;
  description: string;
  amount: string;
  time: string;
}

interface Filters {
  type: 'all' | 'income' | 'expense';
  sortBy: 'highest' | 'lowest' | 'newest' | 'oldest';
  categories: string[];
}

const ExpenseTrackerApp = () => {
  const [selectedMonth] = useState('Month'); // Remove setSelectedMonth if not used
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: 'all', // 'all', 'income', 'expense'
    sortBy: 'newest', // 'highest', 'lowest', 'newest', 'oldest'
    categories: [] // array of selected category names
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      _id: '1',
      description: 'Buy some grocery',
      amount: 120,
      type: 'expense',
      date: new Date(),
      addedBy: 'user123', // This should be the actual user ID from JWT
      category: 'Shopping',
      // UI-only properties
      time: '10:00 AM',
      icon: 'bag-outline',
      color: '#FED7AA'
    },
    {
      _id: '2',
      description: 'Disney+ Annual..',
      amount: 80,
      type: 'expense',
      date: new Date(),
      addedBy: 'user123',
      category: 'Subscription',
      time: '03:30 PM',
      icon: 'tv-outline',
      color: '#DDD6FE'
    },
    {
      _id: '3',
      description: 'Buy a ramen',
      amount: 32,
      type: 'expense',
      date: new Date(),
      addedBy: 'user123',
      category: 'Food',
      time: '07:30 PM',
      icon: 'restaurant-outline',
      color: '#FECACA'
    },
    {
      _id: '4',
      description: 'Salary for July',
      amount: 5000,
      type: 'income',
      date: new Date(Date.now() - 86400000), // Yesterday
      addedBy: 'user123',
      category: 'Salary',
      time: '04:30 PM',
      icon: 'cash-outline',
      color: '#BBF7D0'
    },
    {
      _id: '5',
      description: 'Charging Tesla',
      amount: 18,
      type: 'expense',
      date: new Date(Date.now() - 86400000), // Yesterday
      addedBy: 'user123',
      category: 'Transportation',
      time: '08:30 PM',
      icon: 'car-outline',
      color: '#BFDBFE'
    }
  ]);

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

  const categories: Category[] = [
    { name: 'Shopping', icon: 'bag-outline', color: '#FED7AA' },
    { name: 'Food', icon: 'restaurant-outline', color: '#FECACA' },
    { name: 'Transportation', icon: 'car-outline', color: '#BFDBFE' },
    { name: 'Subscription', icon: 'tv-outline', color: '#DDD6FE' },
    { name: 'Entertainment', icon: 'game-controller-outline', color: '#FBCFE8' },
    { name: 'Bills', icon: 'receipt-outline', color: '#FEF3C7' },
    { name: 'Health', icon: 'medical-outline', color: '#A7F3D0' },
    { name: 'Salary', icon: 'cash-outline', color: '#BBF7D0' },
  ];

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const categoryData = categories.find(cat => cat.name === newTransaction.category);
    
    const transaction: Transaction = {
      _id: Date.now().toString(), // Generate temporary ID (backend will replace with actual ObjectId)
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      date: new Date(),
      addedBy: 'user123', // This should come from JWT token
      category: newTransaction.category,
      // UI-only properties
      time: newTransaction.time,
      icon: categoryData?.icon || 'cash-outline',
      color: categoryData?.color || '#F3F4F6'
    };
    
    setTransactions([transaction, ...transactions]);
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

  // Helper function to create API payload (matches backend schema)
  const createTransactionPayload = (transaction: Transaction) => {
    return {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      addedBy: transaction.addedBy,
      category: transaction.category
    };
  };

  // Example API call function (uncomment when ready to integrate with backend)
  /*
  const saveTransactionToAPI = async (transaction: Transaction) => {
    try {
      const payload = createTransactionPayload(transaction);
      const response = await fetch('YOUR_API_ENDPOINT/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const savedTransaction = await response.json();
        return savedTransaction;
      } else {
        throw new Error('Failed to save transaction');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  };
  */

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
  const todayTransactions = filteredTransactions.filter(t => t.date === 'today');
  const yesterdayTransactions = filteredTransactions.filter(t => t.date === 'yesterday');

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

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: transaction.color }]}>
          <Ionicons name={transaction.icon as any} size={24} color="#374151" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }
        ]}>
          {transaction.type === 'income' ? '+' : '-'} ${transaction.amount}
        </Text>
        <Text style={styles.transactionTime}>{transaction.time}</Text>
      </View>
    </View>
  );

  const CategorySelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.name}
          style={[
            styles.categoryItem,
            { backgroundColor: category.color },
            newTransaction.category === category.name && styles.selectedCategory
          ]}
          onPress={() => setNewTransaction({...newTransaction, category: category.name})}
        >
          <Ionicons name={category.icon as any} size={20} color="#374151" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            
            {/* Type Selection */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === 'expense' && styles.expenseSelected
                ]}
                onPress={() => setNewTransaction({...newTransaction, type: 'expense'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  newTransaction.type === 'expense' && styles.typeButtonTextSelected
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === 'income' && styles.incomeSelected
                ]}
                onPress={() => setNewTransaction({...newTransaction, type: 'income'})}
              >
                <Text style={[
                  styles.typeButtonText,
                  newTransaction.type === 'income' && styles.typeButtonTextSelected
                ]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <Text style={styles.inputLabel}>Category</Text>
            <CategorySelector />

            {/* Description */}
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter description"
              value={newTransaction.description}
              onChangeText={(text) => setNewTransaction({...newTransaction, description: text})}
            />

            {/* Amount */}
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter amount"
              value={newTransaction.amount}
              onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
              keyboardType="numeric"
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddTransaction}
              >
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            {/* Header */}
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter Transaction</Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Filter By Section */}
            <Text style={styles.filterSectionTitle}>Filter By</Text>
            <View style={styles.filterTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.filterTypeButton,
                  filters.type === 'income' && styles.filterTypeSelected
                ]}
                onPress={() => setFilters({ ...filters, type: filters.type === 'income' ? 'all' : 'income' })}
              >
                <Text style={[
                  styles.filterTypeText,
                  filters.type === 'income' && styles.filterTypeTextSelected
                ]}>
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterTypeButton,
                  filters.type === 'expense' && styles.filterTypeSelected
                ]}
                onPress={() => setFilters({ ...filters, type: filters.type === 'expense' ? 'all' : 'expense' })}
              >
                <Text style={[
                  styles.filterTypeText,
                  filters.type === 'expense' && styles.filterTypeTextSelected
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sort By Section */}
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.sortOptionsContainer}>
              <View style={styles.sortRow}>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    filters.sortBy === 'highest' && styles.sortButtonSelected
                  ]}
                  onPress={() => setFilters({ ...filters, sortBy: 'highest' })}
                >
                  <Text style={[
                    styles.sortButtonText,
                    filters.sortBy === 'highest' && styles.sortButtonTextSelected
                  ]}>
                    Highest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    filters.sortBy === 'lowest' && styles.sortButtonSelected
                  ]}
                  onPress={() => setFilters({ ...filters, sortBy: 'lowest' })}
                >
                  <Text style={[
                    styles.sortButtonText,
                    filters.sortBy === 'lowest' && styles.sortButtonTextSelected
                  ]}>
                    Lowest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    filters.sortBy === 'newest' && styles.sortButtonSelected
                  ]}
                  onPress={() => setFilters({ ...filters, sortBy: 'newest' })}
                >
                  <Text style={[
                    styles.sortButtonText,
                    filters.sortBy === 'newest' && styles.sortButtonTextSelected
                  ]}>
                    Newest
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  styles.sortButtonFull,
                  filters.sortBy === 'oldest' && styles.sortButtonSelected
                ]}
                onPress={() => setFilters({ ...filters, sortBy: 'oldest' })}
              >
                <Text style={[
                  styles.sortButtonText,
                  filters.sortBy === 'oldest' && styles.sortButtonTextSelected
                ]}>
                  Oldest
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Section */}
            <Text style={styles.filterSectionTitle}>Category</Text>
            <TouchableOpacity style={styles.categorySelector}>
              <Text style={styles.categorySelectorText}>Choose Category</Text>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{filters.categories.length} Selected</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>

            {/* Category Selection */}
            <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={styles.categoryOption}
                  onPress={() => toggleCategory(category.name)}
                >
                  <View style={styles.categoryOptionLeft}>
                    <View style={[styles.categoryOptionIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon as any} size={16} color="#374151" />
                    </View>
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    filters.categories.includes(category.name) && styles.checkboxSelected
                  ]}>
                    {filters.categories.includes(category.name) && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>

            {/* Bottom indicator */}
            <View style={styles.bottomIndicator} />
          </View>
        </View>
      </Modal>
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