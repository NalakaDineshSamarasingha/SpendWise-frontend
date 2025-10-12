import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/components/AuthGate'; // Import the auth context

import React, { useEffect, useState } from 'react';
import colors from '@/constants/color';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { logout } = useAuth(); // Use auth context

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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout, // Use the logout function from AuthGate
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: 'Account',
      icon: 'person.circle',
      backgroundColor: colors.border,
      onPress: () => router.push('/(tabs)/profile/account'),
    },
    {
      id: 2,
      title: 'Settings',
      icon: 'gear',
      backgroundColor: colors.border,
      onPress: () => console.log('Settings pressed'),
    },
    {
      id: 3,
      title: 'Export Data',
      icon: 'arrow.up.doc',
      backgroundColor: colors.border,
      onPress: () => console.log('Export Data pressed'),
    },
    {
      id: 4,
      title: 'Logout',
      icon: 'rectangle.portrait.and.arrow.right',
      backgroundColor: colors.border,
      onPress: handleLogout,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentGreen} />
      </View>
    );
  }

  const getUserDisplayName = () => {
    return user?.name || user?.displayName || user?.given_name || 'User';
  };

  const getUserProfileImage = () => {
    // Check for profile image URL in token
    return user?.picture || user?.avatar_url || user?.profile_image || null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Profile Section */}
      <ThemedView style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {getUserProfileImage() ? (
            <Image
              source={{ uri: getUserProfileImage() }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultProfileImage}>
              <IconSymbol name="person" size={32} color="#9CA3AF" />
            </View>
          )}
          <View style={styles.profileBorder} />
        </View>
        
        <View style={styles.profileInfo}>
          <ThemedText style={styles.usernameLabel}>Username</ThemedText>
          <ThemedText style={[styles.username, { fontFamily: Fonts.rounded }]}>
            {getUserDisplayName()}
          </ThemedText>
          {user?.email && (
            <ThemedText style={styles.emailText}>{user.email}</ThemedText>
          )}
        </View>
        
        <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
          <IconSymbol name="pencil" size={20} color="#6B7280" />
        </TouchableOpacity>
      </ThemedView>

      {/* Menu Items */}
      <ThemedView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
              <IconSymbol 
                name={item.icon} 
                size={24} 
                color={item.id === 4 ? '#EF4444' : colors.textPrimary} 
              />
            </View>
            <ThemedText style={[
              styles.menuItemText,
              item.id === 4 && { color: '#EF4444' } // Make logout text red
            ]}>
              {item.title}
            </ThemedText>
            <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingVertical: 32,
    marginBottom: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  defaultProfileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: colors.accentBlue,
  },
  profileInfo: {
    flex: 1,
  },
  usernameLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emailText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  menuContainer: {
    width: "96%",
    alignSelf: "center",
    backgroundColor: 'transparent',
    marginTop: 20,
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
});