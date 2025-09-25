import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, RefreshControl } from 'react-native';
import { User, UserData } from '../../services/userService';
import GreetingHeader from './GreetingHeader';
import AccountBalance from './AccountBalance';
import SpendFrequency from './SpendFrequency';
import RecentTransactions from './RecentTransactions';
import colors from '@/constants/color';

interface HomeDashboardProps {
  user: User;
  userData: UserData;
  onRefresh?: () => Promise<void>; // optional refresh callback from parent
}

export default function HomeDashboard({ user, userData, onRefresh }: HomeDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  }, [onRefresh]);

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <GreetingHeader name={user.name} profileImage={user.picture} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load account data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top fixed part */}
      <View style={styles.topContainer}>
        <GreetingHeader name={user.name} profileImage={user.picture} />
        <AccountBalance
          balance={userData.accountBalance}
          income={userData.income}
          expenses={userData.expenses}
        />
      </View>

      <ScrollView
        // style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0, 2]} 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#f59e42"
            colors={['#f59e42']}
          />
        }
      >
        {/* Sticky Header: Spend Frequently */}
        <View style={styles.recentHeaderFixed}>
          <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
            Spend Summery
          </Text>
        </View>

        {/* SpendFrequency Component */}
        <SpendFrequency transactions={userData.transactions}/>

        {/* Sticky Header: Recent Transactions */}
        <View style={styles.recentHeaderFixed}>
          <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
            Recent Transactions
          </Text>
        </View>

        {/* Transactions List */}
        <RecentTransactions transactions={userData.transactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topContainer: {},
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  recentHeaderFixed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#121212',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  seeAll: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});
