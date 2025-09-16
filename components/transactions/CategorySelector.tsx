import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface Category { name: string; icon: string; color: string }

export function CategorySelector({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.name}
          style={[styles.categoryItem, { backgroundColor: category.color }, selected === category.name && styles.selectedCategory]}
          onPress={() => onSelect(category.name)}
        >
          <Ionicons name={category.icon as any} size={20} color="#374151" />
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryScroll: { marginBottom: 8 },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 100,
  },
  selectedCategory: { borderWidth: 2, borderColor: '#3B82F6' },
  categoryText: { fontSize: 14, fontWeight: '500', color: '#374151', marginLeft: 8 },
});
