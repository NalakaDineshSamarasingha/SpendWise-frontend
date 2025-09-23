// services/userService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accountBalance?: number;
  hasAccount?: boolean;
}

export interface UserData {
  accountBalance: number;
  income: number;
  expenses: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  time: string;
  category: string;
  icon: string;
  color: string;
  addedByName: string
}

class UserService {
  private baseUrl = 'https://spendwise-backend-2nvv.onrender.com/expenses'; // Replace with your actual API endpoint

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        console.log('No JWT token found');
        return null;
      }

      const decoded: any = jwtDecode(token);
      console.log('Decoded token:', { ...decoded, iat: '[hidden]', exp: '[hidden]' });
      
      const user: User = {
        id: decoded.sub || decoded.id,
        name: decoded.name || decoded.displayName || decoded.given_name || '',
        email: decoded.email || '',
        picture: decoded.picture || '',
      };
      
      console.log('Current user:', user);
      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  async checkUserAccount(userId: string): Promise<{ hasAccount: boolean; data?: UserData }> {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await fetch(`${this.baseUrl}/user/${userId}/account`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Check user account response status:', response.status);

      if (response.status === 404) {
        console.log('User account not found in database');
        return { hasAccount: false };
      }

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('User account found, raw API data:', apiResponse);

        // Transform API response to match our UserData interface
        const transformedData: UserData = {
          accountBalance: apiResponse.data?.accountBalance ?? 0,
          income: apiResponse.data?.income ?? 0,
          expenses: apiResponse.data?.expenses ?? 0,
          transactions: Array.isArray(apiResponse.data?.transactions)
            ? (apiResponse.data.transactions as unknown as Transaction[])
            : [],
        };

        // Try to fetch additional data like transactions, but only override if meaningful
        try {
          const additionalData = await this.fetchUserExpensesData();
          if (additionalData) {
            const { income, expenses, transactions } = additionalData;
            const hasIncome = typeof income === 'number' && !Number.isNaN(income);
            const hasExpenses = typeof expenses === 'number' && !Number.isNaN(expenses);
            const hasTx = Array.isArray(transactions) && transactions.length > 0;

            if (hasIncome) transformedData.income = income;
            if (hasExpenses) transformedData.expenses = expenses;
            if (hasTx) transformedData.transactions = transactions;
          }
        } catch (error) {
          console.log('Could not fetch additional expenses data:', error);
          // keep the primary API values; do not overwrite with mock unless nothing present
          if (
            transformedData.income === 0 &&
            transformedData.expenses === 0 &&
            (!transformedData.transactions || transformedData.transactions.length === 0)
          ) {
           
          }
        }
        
        console.log('Final transformed user data:', transformedData);
        return { hasAccount: true, data: transformedData };
      }

      const errorText = await response.text();
      console.error('Failed to check user account:', response.status, errorText);
      throw new Error(`Failed to check user account: ${response.status}`);
    } catch (error) {
      console.error('Error checking user account:', error);
      // For development purposes, return mock data
    }
  }

  private async fetchUserExpensesData(): Promise<{ income?: number; expenses?: number; transactions?: Transaction[] } | null> {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      
      // Try to fetch expenses/transactions from the API
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const expensesData = await response.json();
        console.log('Expenses data from API:', expensesData);
        // Only return meaningful overrides if available; otherwise return null to avoid clobbering
        const maybeIncome = (expensesData?.data?.income ?? expensesData?.income);
        const maybeExpenses = (expensesData?.data?.expenses ?? expensesData?.expenses);
        const maybeTransactions = (expensesData?.data?.transactions ?? expensesData?.transactions);

        const hasIncome = typeof maybeIncome === 'number';
        const hasExpenses = typeof maybeExpenses === 'number';
        const hasTx = Array.isArray(maybeTransactions) && maybeTransactions.length > 0;

        if (hasIncome || hasExpenses || hasTx) {
          return {
            income: hasIncome ? maybeIncome : undefined,
            expenses: hasExpenses ? maybeExpenses : undefined,
            transactions: hasTx ? (maybeTransactions as unknown as Transaction[]) : undefined,
          };
        }
      }
      
      return null;
    } catch (error) {
      console.log('Error fetching expenses data:', error);
      return null;
    }
  }

  async createUserAccount(userData: { name: string; email: string }): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      console.log('Creating user account with data:', userData);
      
      const response = await fetch(`${this.baseUrl}/account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: "main",
          userEmail: userData.email,
          userName: userData.name 
        }),
      });

      console.log('Create account response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create account:', response.status, errorText);
        throw new Error(`Failed to create account: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Account created successfully:', result);
      return true;
    } catch (error) {
      console.error('Error creating user account:', error);
      return false;
    }
  }
}

export const userService = new UserService();
