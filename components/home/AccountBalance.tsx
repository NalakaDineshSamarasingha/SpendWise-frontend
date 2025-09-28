// components/home/AccountBalance.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface AccountBalanceProps {
  balance: number;
  income: number;
  expenses: number;
}

export default function AccountBalance({ balance, income, expenses }: AccountBalanceProps) {
  // Add null safety and default values
  const safeBalance = balance ?? 0;
  const safeIncome = income ?? 0;
  const safeExpenses = expenses ?? 0;

  return (
    <>
      {/* Account Balance */}
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Account Balance</Text>
        <Text style={styles.balance}>{safeBalance.toLocaleString()}<Text style={{fontSize: 18, color: '#888'}}>LKR</Text></Text>
      </View>
      
      {/* Income/Expenses Cards */}
      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: '#22c55e' }]}> 
          <View style={styles.cardIcon}>
            <Icon name="arrow-down-left" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.cardLabel}>Income</Text>
            <Text style={styles.cardAmount}>{safeIncome.toLocaleString()}<Text style={{fontSize: 8, color: '#fff'}}>LKR</Text></Text>
          </View>
        </View>
        <View style={[styles.card, {borderWidth:2, borderColor: '#ef4444' ,borderRadius:10,backgroundColor: '#fff'}]}> 
          <View style={styles.cardIcon2}>
            <Icon name="arrow-up-right" size={20} color="#fff" />
          </View>
          <View>
            <Text style={[{color:"000", fontSize: 14 }]}>Expenses</Text>
            <Text style={[{color:"000",   fontSize: 20, 
    fontWeight: 'bold' }]}>{safeExpenses.toLocaleString()}<Text style={{fontSize: 8, color: '#000'}}>LKR</Text></Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  balanceBox: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  balanceLabel: { 
    color: '#888', 
    fontSize: 16, 
    marginBottom: 4 
  },
  balance: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#222' 
  },
  cardsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginHorizontal: 20, 
    marginBottom: 24 
  },
  card: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 10, 
    padding: 16, 
    marginHorizontal: 4 
  },
  cardIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
    cardIcon2: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#ef4444', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  cardLabel: { 
    color: '#fff', 
    fontSize: 14 
  },
  cardAmount: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
});
