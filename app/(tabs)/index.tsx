import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { CreateAccountPrompt, HomeDashboard, LoadingScreen } from '../../components/home';
import { User, UserData, userService } from '../../services/userService';
import { SafeAreaView } from 'react-native';
import colors from "../../constants/color";

interface AppState {
  loading: boolean;
  user: User | null;
  hasAccount: boolean;
  userData: UserData | null;
  isCreatingAccount: boolean;
  refreshing: boolean; // added
}

export default function SpendWiseHomeScreen() {
  const [state, setState] = useState<AppState>({
    loading: true,
    user: null,
    hasAccount: false,
    userData: null,
    isCreatingAccount: false,
    refreshing: false, // added
  });

  const checkUserAccountStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Get current user from token
      const user = await userService.getCurrentUser();
      
      if (!user) {
        // Handle case where user is not authenticated
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          user: null, 
          hasAccount: false 
        }));
        return;
      }

      // Check if user has account in database
      const accountResult = await userService.checkUserAccount(user.id);
      
      setState(prev => ({
        ...prev,
        loading: false,
        user,
        hasAccount: accountResult.hasAccount,
        userData: accountResult.data || null,
      }));
      
    } catch (error) {
      console.error('Error checking user account status:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        hasAccount: false 
      }));
      
      Alert.alert(
        'Error',
        'Failed to load your account. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const handleCreateAccount = useCallback(async () => {
    if (!state.user) {
      console.error('No user found when trying to create account');
      return;
    }
    
    console.log('Starting account creation for user:', state.user.email);
    setState(prev => ({ ...prev, isCreatingAccount: true }));
    
    try {
      const success = await userService.createUserAccount({
        name: state.user.name,
        email: state.user.email,
      });
      
      console.log('Account creation result:', success);
      
      if (success) {
        // Refresh account status after creation
        console.log('Account created successfully, refreshing status...');
        await checkUserAccountStatus();
        Alert.alert(
          'Success!',
          'Your account has been created successfully. Welcome to SpendWise!',
          [{ text: 'Get Started' }]
        );
      } else {
        throw new Error('Failed to create account - API returned false');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert(
        'Error',
        `Failed to create your account: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        [{ text: 'OK' }]
      );
    } finally {
      setState(prev => ({ ...prev, isCreatingAccount: false }));
    }
  }, [state.user, checkUserAccountStatus]);

  const handleRefresh = useCallback(async () => {
    if (state.loading || state.isCreatingAccount) return;
    setState(prev => ({ ...prev, refreshing: true }));
    await checkUserAccountStatus();
    setState(prev => ({ ...prev, refreshing: false }));
  }, [state.loading, state.isCreatingAccount, checkUserAccountStatus]);

  useEffect(() => {
    checkUserAccountStatus();
  }, [checkUserAccountStatus]);

  // Loading state
  if (state.loading) {
    return <LoadingScreen />;
  }

  // User not authenticated
  if (!state.user) {
    return (
      <View style={styles.container}>
        {/* This should not happen if AuthGate is working properly */}
        <LoadingScreen />
      </View>
    );
  }

  // User needs to create account
  if (!state.hasAccount) {
    return (
      <CreateAccountPrompt
        userName={state.user.name}
        onCreateAccount={handleCreateAccount}
        isCreating={state.isCreatingAccount}
      />
    );
  }

  // User has account, show dashboard
  return (
    <SafeAreaView
      style={styles.container}
     
    >
      <HomeDashboard 
        user={state.user} 
        userData={state.userData!} 
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollContent: {
    flexGrow: 1,
  },
});