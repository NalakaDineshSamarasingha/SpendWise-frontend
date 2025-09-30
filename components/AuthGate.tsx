import GoogleLoginButton from '@/components/GoogleLoginButton';
import colors from '@/constants/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

// Create Auth Context
interface AuthContextType {
  token: string | null;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthGate');
  }
  return context;
};

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('jwt_token', newToken);
      setToken(newToken);
      router.replace('/(tabs)'); // Navigate to tabs after login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all auth-related data from AsyncStorage
      await AsyncStorage.multiRemove(['jwt_token', 'userData', 'refreshToken']);
      
      // Reset state immediately
      setToken(null);
      
      // Force navigation to login (this will re-render the login screen)
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if storage clearing fails, reset the state
      setToken(null);
    }
  };

  const authValue: AuthContextType = {
    token,
    login: handleLogin,
    logout: handleLogout,
    isLoading: loading,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentGreen} />
      </View>
    );
  }

  if (!token) {
    return (
      <AuthContext.Provider value={authValue}>
        <View style={styles.container}>
          <View style={styles.logoSection}>
            <Image source={require('@/assets/images/spendwise.png')} style={styles.logo} />
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue and take control of your finances</Text>
          </View>
          <View style={styles.loginSection}>
            <GoogleLoginButton onLogin={handleLogin} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Secure • Private • Easy to Use</Text>
          </View>
        </View>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.8,
    color: colors.textDisabled,
  },
});