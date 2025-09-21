import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

import React, { useEffect, useRef, useState } from 'react';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collaborators, setCollaborators] = useState<{email:string; id?:string}[]>([]);
  const [collabEmail, setCollabEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [collabError, setCollabError] = useState<string | null>(null);
  const [collabSuccess, setCollabSuccess] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{id:string; email:string; displayName?:string; picture?:string;}[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [addingMemberEmail, setAddingMemberEmail] = useState<string | null>(null); // NEW: track selected member add
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastQueryRef = useRef('');
  const router = useRouter();
  const DEBUG = true; // NEW: toggle verbose backend logging
  // NOTE: API_BASE has a leading 'h' typo previously; keep if intentional, otherwise fix:
  const API_BASE = 'https://spendwise-backend-2nvv.onrender.com'; // FIXED (was hhttps://) for valid requests

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

  useEffect(() => {
    // fetch collaborators after user loaded
    if (user) fetchCollaborators();
  }, [user]);

  const fetchCollaborators = async () => {
    try {
      setCollabError(null);
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) return;
      // Adjust endpoint path to your backend
      if (DEBUG) console.log('[Collaborators] GET /collaborators start');
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com'}/collaborators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (DEBUG) console.log('[Collaborators] status:', res.status);
      const raw = await res.text();
      if (DEBUG) console.log('[Collaborators] raw body:', raw);
      if (!res.ok) throw new Error('Failed to load collaborators');
      const data = (() => { try { return JSON.parse(raw); } catch { return {}; } })();
      setCollaborators(Array.isArray(data) ? data : (data?.collaborators || []));
    } catch (e:any) {
      if (DEBUG) console.log('[Collaborators] error:', e);
      setCollabError(e.message || 'Failed to fetch collaborators');
    }
  };
  
  const fetchUserSuggestions = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); lastQueryRef.current=''; return; }
    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setSuggestLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) throw new Error('No auth');
      const url = `${API_BASE}/account/users/suggest?q=${encodeURIComponent(q)}`;
      if (DEBUG) console.log('[Suggest] GET', url);
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }, // RE-ENABLED
        signal: ctrl.signal,
      });
      if (DEBUG) console.log('[Suggest] status:', resp.status);
      const raw = await resp.text();
      if (DEBUG) console.log('[Suggest] raw body:', raw);
      if (!resp.ok) throw new Error('Suggest failed');
      let json: any = [];
      try { json = JSON.parse(raw); } catch { if (DEBUG) console.log('[Suggest] JSON parse failed'); }
      setSuggestions(Array.isArray(json.users) ? json.users : []);
    } catch (e:any) {
      if (e.name !== 'AbortError') {
        if (DEBUG) console.log('[Suggest] error:', e);
        setSuggestions([]);
      } else if (DEBUG) {
        console.log('[Suggest] aborted previous request');
      }
    } finally {
      setSuggestLoading(false);
    }
  };

  // NEW: watch collabEmail for suggestion triggering (debounce 350ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = collabEmail.trim().toLowerCase();
    if (q.length < 3) {
      setSuggestions([]);
      lastQueryRef.current = '';
      return;
    }
    debounceRef.current = setTimeout(() => fetchUserSuggestions(q), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [collabEmail]);

  const handleAddCollaborator = async () => {
    setCollabError(null);
    setCollabSuccess(null);
    const email = collabEmail.trim().toLowerCase();
    if (!email) { setCollabError('Email required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setCollabError('Invalid email'); return; }
    if (user?.email && email === user.email.toLowerCase()) { setCollabError('Cannot add yourself'); return; }
    if (collaborators.some(c => c.email.toLowerCase() === email)) { setCollabError('Already added'); return; }
    setAdding(true);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) throw new Error('Auth missing');
      const url = `${process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com'}/collaborators`;
      if (DEBUG) console.log('[AddCollaborator] POST', url, 'email:', email);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email })
      });
      const raw = await res.text();
      if (DEBUG) {
        console.log('[AddCollaborator] status:', res.status);
        console.log('[AddCollaborator] raw body:', raw);
      }
      if (!res.ok) {
        throw new Error(raw || 'Failed to add collaborator');
      }
      setCollabSuccess('Collaborator added (pending acceptance if required).');
      setCollabEmail('');
      fetchCollaborators();
    } catch (e:any) {
      if (DEBUG) console.log('[AddCollaborator] error:', e);
      setCollabError(e.message || 'Add failed');
    } finally {
      setAdding(false);
      setTimeout(() => { setCollabSuccess(null); }, 4000);
    }
  };

  // NEW: add member directly when selecting a suggestion
  const handleSelectSuggestion = async (u: { email: string }) => {
    setCollabError(null);
    setCollabSuccess(null);
    setAdding(true);
    setAddingMemberEmail(u.email);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) throw new Error('Auth missing');
      const url = `${API_BASE}/account/members`;
      if (DEBUG) console.log('[AddMember] POST', url, 'email:', u.email);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: u.email })
      });
      const raw = await res.text();
      if (DEBUG) {
        console.log('[AddMember] status:', res.status);
        console.log('[AddMember] raw body:', raw);
      }
      if (!res.ok) throw new Error(raw || 'Failed to add member');
      setCollabSuccess('Member added (pending acceptance if required).');
      setCollabEmail('');
      setSuggestions([]);
      fetchCollaborators();
    } catch (e:any) {
      if (DEBUG) console.log('[AddMember] error:', e);
      setCollabError(e.message || 'Failed to add member');
    } finally {
      setAdding(false);
      setAddingMemberEmail(null);
      setTimeout(() => { setCollabSuccess(null); }, 4000);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    router.replace('/');
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Account',
      icon: 'person.circle',
      backgroundColor: '#E8D5FF',
      onPress: () => console.log('Account pressed'),
    },
    {
      id: 2,
      title: 'Settings',
      icon: 'gear',
      backgroundColor: '#E8D5FF',
      onPress: () => console.log('Settings pressed'),
    },
    {
      id: 3,
      title: 'Export Data',
      icon: 'arrow.up.doc',
      backgroundColor: '#E8D5FF',
      onPress: () => console.log('Export Data pressed'),
    },
    {
      id: 4,
      title: 'Logout',
      icon: 'rectangle.portrait.and.arrow.right',
      backgroundColor: '#FECACA',
      onPress: handleLogout,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                    color={item.id === 4 ? '#EF4444' : '#8B5CF6'} 
                  />
                </View>
                <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {/* Collaborators Section */}
          <View style={styles.collabSection}>
            <Text style={styles.collabTitle}>Collaborators</Text>
            <Text style={styles.collabHelper}>Add another user by email to share this account.</Text>
            <View style={styles.collabRow}>
              <TextInput
                style={styles.emailInput}
                placeholder="user@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={collabEmail}
                onChangeText={setCollabEmail}
                editable={!adding}
              />
              <TouchableOpacity
                style={[styles.addBtn, adding && { opacity: 0.6 }]}
                onPress={handleAddCollaborator}
                disabled={adding}
                activeOpacity={0.7}
              >
                <Text style={styles.addBtnText}>{adding ? '...' : 'Add'}</Text>
              </TouchableOpacity>
            </View>

            {/* NEW: suggestions dropdown */}
            {(suggestLoading || suggestions.length > 0) && (
              <View style={styles.suggestBox}>
                {suggestLoading && suggestions.length === 0 ? (
                  <View style={styles.suggestLoadingRow}>
                    <ActivityIndicator size="small" />
                    <Text style={styles.suggestLoadingText}>Searching...</Text>
                  </View>
                ) : (
                  suggestions.map(u => (
                    <TouchableOpacity
                      key={u.id}
                      style={styles.suggestItem}
                      activeOpacity={0.6}
                      onPress={() => handleSelectSuggestion(u)} // CHANGED: auto add member
                      disabled={adding && addingMemberEmail === u.email}
                    >
                      {addingMemberEmail === u.email ? (
                        <ActivityIndicator size="small" style={{ width: 32 }} />
                      ) : u.picture ? (
                        <Image source={{ uri: u.picture }} style={styles.suggestAvatar} />
                      ) : (
                        <View style={styles.suggestAvatarFallback}>
                          <IconSymbol name="person" size={18} color="#6B7280" />
                        </View>
                      )}
                      <View style={styles.suggestInfo}>
                        <Text style={styles.suggestEmail}>{u.email}</Text>
                        {!!u.displayName && <Text style={styles.suggestName}>{u.displayName}</Text>}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {collabError && <Text style={styles.errorText}>{collabError}</Text>}
            {collabSuccess && <Text style={styles.successText}>{collabSuccess}</Text>}
            <FlatList
              data={collaborators}
              keyExtractor={(item, idx) => item.id || item.email || String(idx)}
              style={styles.collabList}
              contentContainerStyle={collaborators.length === 0 && { paddingVertical: 8 }}
              ListEmptyComponent={<Text style={styles.emptyText}>No collaborators yet.</Text>}
              renderItem={({ item }) => (
                <View style={styles.collabItem}>
                  <IconSymbol name="person.2" size={18} color="#6366F1" />
                  <Text style={styles.collabEmail}>{item.email}</Text>
                </View>
              )}
            />
            <TouchableOpacity onPress={fetchCollaborators} style={styles.refreshBtn} activeOpacity={0.6}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
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
    borderColor: '#A855F7',
  },
  profileInfo: {
    flex: 1,
  },
  usernameLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
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
    color: '#111827',
    flex: 1,
  },
  collabSection: {
    marginTop: 12,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    paddingBottom: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  collabTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  collabHelper: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  collabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 4,
  },
  successText: {
    color: '#10B981',
    fontSize: 12,
    marginBottom: 4,
  },
  collabList: {
    maxHeight: 180,
    marginTop: 4,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  collabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  collabEmail: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  refreshBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  refreshText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  // NEW suggestion styles
  suggestBox: {
    marginTop: -4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  suggestLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  suggestLoadingText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  suggestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  suggestAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestInfo: {
    marginLeft: 10,
    flex: 1,
  },
  suggestEmail: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  suggestName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});