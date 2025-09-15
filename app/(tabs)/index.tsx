import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Use Feather icons for demo

export default function SpendWiseHomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>J</Text></View>
          <View style={styles.monthBox}>
            <Text style={styles.monthText}>October</Text>
            <Icon name="chevron-down" size={16} color="#8B5CF6" />
          </View>
          <Icon name="bell" size={24} color="#8B5CF6" />
        </View>
        {/* Account Balance */}
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Account Balance</Text>
          <Text style={styles.balance}>9400LKR</Text>
        </View>
        {/* Income/Expenses Cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: '#22c55e' }]}> 
            <View style={styles.cardIcon}><Icon name="arrow-down-left" size={20} color="#fff" /></View>
            <View>
              <Text style={styles.cardLabel}>Income</Text>
              <Text style={styles.cardAmount}>5000LKR</Text>
            </View>
          </View>
          <View style={[styles.card, { backgroundColor: '#ef4444' }]}> 
            <View style={styles.cardIcon}><Icon name="arrow-up-right" size={20} color="#fff" /></View>
            <View>
              <Text style={styles.cardLabel}>Expenses</Text>
              <Text style={styles.cardAmount}>1200LKR</Text>
            </View>
          </View>
        </View>
        {/* Spend Frequency Chart Placeholder */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Spend Frequency</Text>
          <View style={styles.chartPlaceholder} />
          <View style={styles.tabsRow}>
            <Text style={styles.tabActive}>Today</Text>
            <Text style={styles.tab}>Week</Text>
            <Text style={styles.tab}>Month</Text>
            <Text style={styles.tab}>Year</Text>
          </View>
        </View>
        {/* Recent Transactions */}
        <View style={styles.sectionBox}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Transaction</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          {/* Transactions */}
          <View style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: '#fb923c' }]}><Icon name="shopping-bag" size={20} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txType}>Shopping</Text>
              <Text style={styles.txDesc}>Buy some grocery</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.txAmountNeg}>- $120</Text>
              <Text style={styles.txTime}>10:00 AM</Text>
            </View>
          </View>
          <View style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: '#8B5CF6' }]}><Icon name="tv" size={20} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txType}>Subscription</Text>
              <Text style={styles.txDesc}>Disney+ Annual..</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.txAmountNeg}>- $80</Text>
              <Text style={styles.txTime}>03:30 PM</Text>
            </View>
          </View>
          <View style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: '#ef4444' }]}><Icon name="coffee" size={20} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txType}>Food</Text>
              <Text style={styles.txDesc}>Buy a ramen</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.txAmountNeg}>- $32</Text>
              <Text style={styles.txTime}>07:30 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  monthBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  monthText: { color: '#8B5CF6', fontWeight: 'bold', marginRight: 6 },
  balanceBox: { alignItems: 'center', marginBottom: 24 },
  balanceLabel: { color: '#888', fontSize: 16, marginBottom: 4 },
  balance: { fontSize: 40, fontWeight: 'bold', color: '#222' },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 24 },
  card: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 16, marginHorizontal: 4 },
  cardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardLabel: { color: '#fff', fontSize: 14 },
  cardAmount: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  sectionBox: { marginHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  chartPlaceholder: { height: 80, backgroundColor: '#e0e7ff', borderRadius: 16, marginBottom: 10 },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tabActive: { color: '#f59e42', fontWeight: 'bold', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fef3c7', borderRadius: 12 },
  tab: { color: '#888', paddingHorizontal: 12, paddingVertical: 6 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  seeAll: { color: '#8B5CF6', fontWeight: 'bold' },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  txIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txType: { fontWeight: 'bold', color: '#333' },
  txDesc: { color: '#888', fontSize: 12 },
  txAmountNeg: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
  txTime: { color: '#aaa', fontSize: 12 },
  tabBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#eee', elevation: 10 },
  tabBarItem: { alignItems: 'center', flex: 1 },
  tabBarItemCenter: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginHorizontal: 8, elevation: 4 },
  tabBarLabel: { fontSize: 12, color: '#aaa', marginTop: 2 },
  tabBarLabelActive: { fontSize: 12, color: '#8B5CF6', fontWeight: 'bold', marginTop: 2 },
});