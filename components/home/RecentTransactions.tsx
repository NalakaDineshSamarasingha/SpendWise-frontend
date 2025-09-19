// components/home/RecentTransactions.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Transaction } from '../../services/userService';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Add null safety
  const safeTransactions = useMemo(() => transactions || [], [transactions]);

  // Map category -> icon/color (Feather icon set)
  const getIconColorForCategory = (category?: string): { icon: string; color: string } => {
    const key = (category || '').toLowerCase();
    switch (key) {
      case 'shopping':
        return { icon: 'shopping-bag', color: '#fb923c' };
      case 'food':
        return { icon: 'coffee', color: '#ef4444' };
      case 'transportation':
        return { icon: 'truck', color: '#60a5fa' };
      case 'subscription':
        return { icon: 'tv', color: '#8B5CF6' };
      case 'entertainment':
        return { icon: 'film', color: '#ec4899' };
      case 'bills':
        return { icon: 'file-text', color: '#f59e0b' };
      case 'health':
        return { icon: 'heart', color: '#10b981' };
      case 'salary':
      case 'income':
        return { icon: 'dollar-sign', color: '#22c55e' };
      case 'expense':
        return { icon: 'arrow-down-right', color: '#ef4444' };
      default:
        return { icon: 'dollar-sign', color: '#6B7280' }; // neutral fallback
    }
  };

  // Apply fallback icon/color based on category if not provided
  const mappedTransactions = useMemo(() =>
    safeTransactions.map((t) => {
      const fallback = getIconColorForCategory(t.category);
      return {
        ...t,
        icon: t.icon || fallback.icon,
        color: t.color || fallback.color,
      };
    })
  , [safeTransactions]);

  return (
    <View style={styles.sectionBox}>
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Transaction</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      
      {mappedTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      ) : (
        mappedTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: transaction.color }]}>
              <Icon name={transaction.icon as any} size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txType}>{transaction.category}</Text>
              <Text style={styles.txDesc}>{transaction.description}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={[
                  styles.txAmountNeg,
                  transaction.type === 'income' && { color: '#22c55e' }, // green for income
                  transaction.type !== 'income' && { color: '#ef4444' }  // red for expense
                ]}
              >
                {transaction.type === 'income'? '+ ' : '- '}${Math.abs(transaction.amount)}
              </Text>
              <Text style={styles.txTime}>{transaction.time}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionBox: { 
    marginHorizontal: 20, 
    marginBottom: 24 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 12 
  },
  recentHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  seeAll: { 
    color: '#8B5CF6', 
    fontWeight: 'bold' 
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
  txRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 12, 
    marginBottom: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    shadowRadius: 2, 
    elevation: 1 
  },
  txIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  txType: { 
    fontWeight: 'bold', 
    color: '#333' 
  },
  txDesc: { 
    color: '#888', 
    fontSize: 12 
  },
  txAmountNeg: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  txTime: { 
    color: '#aaa', 
    fontSize: 12 
  },
});
