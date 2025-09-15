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
          accountBalance: apiResponse.data?.balance || 0,
          income: 0, // TODO: Get from expenses API
          expenses: 0, // TODO: Get from expenses API
          transactions: [], // TODO: Get from transactions API
        };
        
        // Try to fetch additional data like transactions
        try {
          const additionalData = await this.fetchUserExpensesData();
          if (additionalData) {
            transformedData.income = additionalData.income;
            transformedData.expenses = additionalData.expenses;
            transformedData.transactions = additionalData.transactions;
          }
        } catch (error) {
          console.log('Could not fetch additional expenses data:', error);
          // Use mock data for development
          const mockData = this.getMockUserData();
          transformedData.income = mockData.data.income;
          transformedData.expenses = mockData.data.expenses;
          transformedData.transactions = mockData.data.transactions;
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
      console.log('Using mock data for development');
      return this.getMockUserData();
    }
  }

  private async fetchUserExpensesData(): Promise<{ income: number; expenses: number; transactions: Transaction[] } | null> {
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
        
        // Transform expenses data to match our interface
        // This would need to be adjusted based on your actual API response structure
        return {
          income: 0, // Calculate from expensesData if available
          expenses: 0, // Calculate from expensesData if available
          transactions: [], // Transform expensesData to transactions if available
        };
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
  private getMockUserData(): { hasAccount: boolean; data: UserData } {
    return {
      hasAccount: true,
      data: {
        accountBalance: 9400,
        income: 5000,
        expenses: 1200,
        transactions: [
          {
            id: '1',
            type: 'Shopping',
            description: 'Buy some grocery',
            amount: -120,
            time: '10:00 AM',
            category: 'shopping',
            icon: 'shopping-bag',
            color: '#fb923c',
          },
          {
            id: '2',
            type: 'Subscription',
            description: 'Disney+ Annual..',
            amount: -80,
            time: '03:30 PM',
            category: 'entertainment',
            icon: 'tv',
            color: '#8B5CF6',
          },
          {
            id: '3',
            type: 'Food',
            description: 'Buy a ramen',
            amount: -32,
            time: '07:30 PM',
            category: 'food',
            icon: 'coffee',
            color: '#ef4444',
          },
        ],
      },
    };
  }
}

export const userService = new UserService();
