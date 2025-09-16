import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Filters {
  type: 'all' | 'income' | 'expense';
  sortBy: 'highest' | 'lowest' | 'newest' | 'oldest';
  categories: string[];
}

export interface Category { name: string; icon: string; color: string }

export function FilterModal({
  visible,
  onClose,
  filters,
  setFilters,
  categories,
  resetFilters,
  toggleCategory,
}: {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  categories: Category[];
  resetFilters: () => void;
  toggleCategory: (name: string) => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.filterModalContent}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter Transaction</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Filter By</Text>
          <View style={styles.filterTypeContainer}>
            <TouchableOpacity
              style={[styles.filterTypeButton, filters.type === 'income' && styles.filterTypeSelected]}
              onPress={() => setFilters({ ...filters, type: filters.type === 'income' ? 'all' : 'income' })}
            >
              <Text style={[styles.filterTypeText, filters.type === 'income' && styles.filterTypeTextSelected]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTypeButton, filters.type === 'expense' && styles.filterTypeSelected]}
              onPress={() => setFilters({ ...filters, type: filters.type === 'expense' ? 'all' : 'expense' })}
            >
              <Text style={[styles.filterTypeText, filters.type === 'expense' && styles.filterTypeTextSelected]}>Expense</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Sort By</Text>
          <View style={styles.sortOptionsContainer}>
            <View style={styles.sortRow}>
              {(['highest','lowest','newest'] as const).map(key => (
                <TouchableOpacity key={key} style={[styles.sortButton, filters.sortBy === key && styles.sortButtonSelected]} onPress={() => setFilters({ ...filters, sortBy: key })}>
                  <Text style={[styles.sortButtonText, filters.sortBy === key && styles.sortButtonTextSelected]}>{key[0].toUpperCase()+key.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.sortButton, styles.sortButtonFull, filters.sortBy === 'oldest' && styles.sortButtonSelected]} onPress={() => setFilters({ ...filters, sortBy: 'oldest' })}>
              <Text style={[styles.sortButtonText, filters.sortBy === 'oldest' && styles.sortButtonTextSelected]}>Oldest</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Category</Text>
          <TouchableOpacity style={styles.categorySelector}>
            <Text style={styles.categorySelectorText}>Choose Category</Text>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountText}>{filters.categories.length} Selected</Text>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>

          <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category.name} style={styles.categoryOption} onPress={() => toggleCategory(category.name)}>
                <View style={styles.categoryOptionLeft}>
                  <View style={[styles.categoryOptionIcon, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon as any} size={16} color="#374151" />
                  </View>
                  <Text style={styles.categoryOptionText}>{category.name}</Text>
                </View>
                <View style={[styles.checkbox, filters.categories.includes(category.name) && styles.checkboxSelected]}>
                  {filters.categories.includes(category.name) && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
          <View style={styles.bottomIndicator} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  filterModalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, width: '100%', maxHeight: '90%', marginTop: 'auto' },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  resetText: { fontSize: 16, fontWeight: '500', color: '#8B5CF6' },
  filterSectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12, marginTop: 20 },
  filterTypeContainer: { flexDirection: 'row', marginBottom: 8 },
  filterTypeButton: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 12 },
  filterTypeSelected: { backgroundColor: '#8B5CF6' },
  filterTypeText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  filterTypeTextSelected: { color: '#FFFFFF' },
  sortOptionsContainer: { marginBottom: 8 },
  sortRow: { flexDirection: 'row', marginBottom: 12 },
  sortButton: { backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 12 },
  sortButtonFull: { alignSelf: 'flex-start' },
  sortButtonSelected: { backgroundColor: '#111827' },
  sortButtonText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  sortButtonTextSelected: { color: '#FFFFFF' },
  categorySelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginBottom: 16 },
  categorySelectorText: { fontSize: 16, fontWeight: '500', color: '#111827' },
  categoryCount: { flexDirection: 'row', alignItems: 'center' },
  categoryCountText: { fontSize: 14, color: '#6B7280', marginRight: 4 },
  categoryList: { maxHeight: 200, marginBottom: 24 },
  categoryOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  categoryOptionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryOptionIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  categoryOptionText: { fontSize: 16, fontWeight: '500', color: '#111827' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  applyButton: { backgroundColor: '#8B5CF6', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  applyButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  bottomIndicator: { width: 40, height: 4, backgroundColor: '#000000', borderRadius: 2, alignSelf: 'center' },
});
