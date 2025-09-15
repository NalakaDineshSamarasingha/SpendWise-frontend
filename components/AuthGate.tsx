import GoogleLoginButton from '@/components/GoogleLoginButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('jwt_token').then(storedToken => {
      setToken(storedToken);
      setLoading(false);
    });
  }, []);

  const handleLogin = async (newToken: string) => {
    await AsyncStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    router.replace('/'); // Go to home page after login
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          <Text style={styles.appName}>SpendWise</Text>
          <Text style={styles.tagline}>Smart Financial Tracking</Text>
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
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
    backgroundColor: '#f8fafc',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    opacity: 0.9,
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
    color: '#666',
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
    color: '#888',
  },
});
