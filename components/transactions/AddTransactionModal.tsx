import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Category, CategorySelector } from './CategorySelector';

export type NewTransaction = {
  type: 'expense' | 'income';
  category: string;
  description: string;
  amount: string; // input
  time: string;
};

export function AddTransactionModal({
  visible,
  onClose,
  newTransaction,
  setNewTransaction,
  categories,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  newTransaction: NewTransaction;
  setNewTransaction: (t: NewTransaction) => void;
  categories: Category[];
  onSave: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Transaction</Text>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, newTransaction.type === 'expense' && styles.expenseSelected]}
              onPress={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
            >
              <Text style={[styles.typeButtonText, newTransaction.type === 'expense' && styles.typeButtonTextSelected]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, newTransaction.type === 'income' && styles.incomeSelected]}
              onPress={() => setNewTransaction({ ...newTransaction, type: 'income' })}
            >
              <Text style={[styles.typeButtonText, newTransaction.type === 'income' && styles.typeButtonTextSelected]}>Income</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Category</Text>
          <CategorySelector
            categories={categories}
            selected={newTransaction.category}
            onSelect={(name) => setNewTransaction({ ...newTransaction, category: name })}
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter description"
            value={newTransaction.description}
            onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
          />

          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter amount"
            value={newTransaction.amount}
            onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
            keyboardType="numeric"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 24, color: '#111827' },
  typeSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 16, padding: 4, marginBottom: 20 },
  typeButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  typeButtonText: { fontSize: 16, fontWeight: '500', color: '#6B7280' },
  typeButtonTextSelected: { color: '#FFFFFF' },
  expenseSelected: { backgroundColor: '#EF4444' },
  incomeSelected: { backgroundColor: '#10B981' },
  inputLabel: { fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 8, marginTop: 16 },
  textInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#111827', marginBottom: 8 },
  modalButtons: { flexDirection: 'row', marginTop: 24 },
  cancelButton: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 16, marginRight: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  saveButton: { flex: 1, backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
