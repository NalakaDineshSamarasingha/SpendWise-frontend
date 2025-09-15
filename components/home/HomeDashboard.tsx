// components/home/HomeDashboard.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { User, UserData } from '../../services/userService';
import AccountBalance from './AccountBalance';
import GreetingHeader from './GreetingHeader';
import RecentTransactions from './RecentTransactions';
import SpendFrequency from './SpendFrequency';

interface HomeDashboardProps {
  user: User;
  userData: UserData;
}

export default function HomeDashboard({ user, userData }: HomeDashboardProps) {
  // Add null safety for userData
  if (!userData) {
    return (
      <View style={styles.container}>
        <GreetingHeader name={user.name} profileImage={user.picture} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load account data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GreetingHeader name={user.name} profileImage={user.picture} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AccountBalance 
          balance={userData.accountBalance}
          income={userData.income}
          expenses={userData.expenses}
        />
        
        <SpendFrequency />
        
        <RecentTransactions transactions={userData.transactions} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  scrollContent: { 
    paddingBottom: 100, 
    paddingTop: 0 
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
