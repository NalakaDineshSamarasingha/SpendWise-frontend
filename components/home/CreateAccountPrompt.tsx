// components/home/CreateAccountPrompt.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface CreateAccountPromptProps {
  userName: string;
  onCreateAccount: () => void;
  isCreating?: boolean;
}

export default function CreateAccountPrompt({ 
  userName, 
  onCreateAccount, 
  isCreating = false 
}: CreateAccountPromptProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="user-plus" size={64} color="#8B5CF6" />
        </View>
        
        <Text style={styles.title}>Welcome to SpendWise!</Text>
        <Text style={styles.subtitle}>
          Hi {userName}! We notice this is your first time here.
        </Text>
        <Text style={styles.description}>
          Create your account to start tracking your expenses, setting budgets, 
          and achieving your financial goals.
        </Text>
        
        <TouchableOpacity 
          style={[styles.createButton, isCreating && styles.buttonDisabled]}
          onPress={onCreateAccount}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Icon name="plus-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Create Account</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What you&apos;ll get:</Text>
          <View style={styles.feature}>
            <Icon name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.featureText}>Track your income and expenses</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.featureText}>Set and monitor budgets</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.featureText}>Plan trips and big purchases</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="check-circle" size={16} color="#22c55e" />
            <Text style={styles.featureText}>Detailed spending analytics</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
    minWidth: 200,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  featuresContainer: {
    width: '100%',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});
