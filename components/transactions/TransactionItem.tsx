import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface UITransaction {
  _id?: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  date: Date | string;
  addedBy: string;
  category?: string;
  time?: string;
  icon?: string;
  color?: string;
}

export function TransactionItem({ transaction }: { transaction: UITransaction }) {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: transaction.color }]}>
          <Ionicons name={(transaction.icon as any) || 'cash-outline'} size={24} color="#374151" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            { color: transaction.type === 'income' ? '#10B981' : '#EF4444' },
          ]}
        >
          {transaction.type === 'income' ? '+' : '-'} ${transaction.amount}
        </Text>
        <Text style={styles.transactionTime}>{transaction.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  transactionInfo: { flex: 1 },
  transactionCategory: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  transactionDescription: { fontSize: 14, color: '#6B7280' },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  transactionTime: { fontSize: 14, color: '#6B7280' },
});
