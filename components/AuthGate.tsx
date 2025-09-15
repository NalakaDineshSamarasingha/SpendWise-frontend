import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useRouter } from 'expo-router';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('jwt_token').then(storedToken => {
      setToken(storedToken);
      setLoading(false);
      if (storedToken) {
        router.replace('/'); // Go to home page
      }
    });
  }, []);

  const handleLogin = async (newToken: string) => {
    await AsyncStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    router.replace('/'); // Go to home page
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  if (!token) {
    return <GoogleLoginButton onLogin={handleLogin} />;
  }

  return <>{children}</>;
}
