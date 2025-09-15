import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

// ...existing code...
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

import React, { useEffect, useState } from 'react';


export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    router.replace('/');
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}>
          Profile
        </ThemedText>
      </ThemedView>
      {user ? (
        <ThemedView style={{ marginBottom: 24 }}>
          <ThemedText type="subtitle">User Details</ThemedText>
          <ThemedText>Name: {user.name || user.displayName || user.given_name || 'N/A'}</ThemedText>
          <ThemedText>Email: {user.email || 'N/A'}</ThemedText>
        </ThemedView>
      ) : (
        <ThemedText>No user details found.</ThemedText>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText type="link">Logout</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
});
