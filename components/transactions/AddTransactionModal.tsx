import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Category, CategorySelector } from './CategorySelector';
import colors from '@/constants/color';
import { Colors } from '@/constants/theme';

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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: colors.background, borderRadius: 10, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 24, color: colors.textPrimary },
  typeSelector: { flexDirection: 'row', backgroundColor: colors.backgroundSecondary, borderRadius: 10, padding: 4, marginBottom: 20 },
  typeButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  typeButtonText: { fontSize: 16, fontWeight: '500', color: '#6B7280' },
  typeButtonTextSelected: { color: '#FFFFFF' },
  expenseSelected: { backgroundColor: '#EF4444' },
  incomeSelected: { backgroundColor: '#10B981' },
  inputLabel: { fontSize: 16, fontWeight: '500', color: colors.textSecondary, marginBottom: 8, marginTop: 16 },
  textInput: { backgroundColor: colors.border, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: colors.textPrimary, marginBottom: 8 },
  modalButtons: { flexDirection: 'row', marginTop: 24 },
  cancelButton: { flex: 1, backgroundColor: colors.border, paddingVertical: 16, borderRadius: 16, marginRight: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  saveButton: { flex: 1, backgroundColor: colors.accentBlue, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
