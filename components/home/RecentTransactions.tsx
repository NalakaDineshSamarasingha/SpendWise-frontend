import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Transaction } from '../../services/userService';
import { getIconColorForCategory } from '../../utils/categoryMap';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const safeTransactions = useMemo(() => transactions || [], [transactions]);
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

      {/* Scrollable transactions */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
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
                {transaction.addedByName && (
                  <Text style={styles.txBy}>by {transaction.addedByName}</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={[
                    styles.txAmountNeg,
                    transaction.type === 'income' && { color: '#22c55e' },
                    transaction.type !== 'income' && { color: '#ef4444' }
                  ]}
                >
                  {transaction.type === 'income'? '+ ' : '- '}${Math.abs(transaction.amount)}
                </Text>
                <Text style={styles.txTime}>{transaction.time}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionBox: { 
    marginHorizontal: 20, 
    marginBottom: 24,
    flex: 1, // allow ScrollView to fill remaining space
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222' 
  },
  recentHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
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
  txBy: {
    color: '#555',
    fontSize: 11,
    marginTop: 2
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
