// app/(tabs)/profile/account.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Collaborator {
  id?: string;
  email: string;
  displayName?: string | null;
  picture?: string | null;
  role?: string;
  createdAt?: string;
}

export default function AccountCollaborators() {
  // collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // add collaborator
  const [collabEmail, setCollabEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [collabError, setCollabError] = useState<string | null>(null);
  const [collabSuccess, setCollabSuccess] = useState<string | null>(null);

  // suggestions
  const [suggestions, setSuggestions] = useState<Collaborator[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [addingMemberEmail, setAddingMemberEmail] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef("");

  const API_BASE = "https://spendwise-backend-2nvv.onrender.com";

  const getToken = async () =>
    (await AsyncStorage.getItem("jwt_token")) ||
    (await AsyncStorage.getItem("token"));

  const fetchCollaborators = useCallback(async () => {
    try {
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");
      const res = await fetch(`${API_BASE}/account/collaborators`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await res.text();
      if (!res.ok) throw new Error("Failed to load collaborators");
      let data: any = {};
      try { data = JSON.parse(raw); } catch {}
      const list: Collaborator[] = Array.isArray(data)
        ? data
        : (data.users || data.collaborators || []);
      setCollaborators(list);
    } catch (e: any) {
      setError(e.message || "Failed to load collaborators");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  const fetchUserSuggestions = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); lastQueryRef.current = ""; return; }
    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setSuggestLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth");
      const url = `${API_BASE}/account/users/suggest?q=${encodeURIComponent(q)}`;
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: ctrl.signal,
      });
      const raw = await resp.text();
      if (!resp.ok) throw new Error("Suggest failed");
      let json: any = {};
      try { json = JSON.parse(raw); } catch {}
      setSuggestions(Array.isArray(json.users) ? json.users : []);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setSuggestions([]);
      }
    } finally {
      setSuggestLoading(false);
    }
  };

  // debounce suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = collabEmail.trim().toLowerCase();
    if (q.length < 3) {
      setSuggestions([]);
      lastQueryRef.current = "";
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
    if (!email) { setCollabError("Email required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setCollabError("Invalid email"); return; }
    if (collaborators.some(c => c.email.toLowerCase() === email)) { setCollabError("Already added"); return; }
    setAdding(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Auth missing");
      const url = `${API_BASE}/account/collaborators`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(raw || "Failed to add collaborator");
      setCollabSuccess("Collaborator added.");
      setCollabEmail("");
      setSuggestions([]);
      fetchCollaborators();
    } catch (e: any) {
      setCollabError(e.message || "Add failed");
    } finally {
      setAdding(false);
      setTimeout(() => setCollabSuccess(null), 3500);
    }
  };

  const handleSelectSuggestion = async (u: { email: string }) => {
    setAddingMemberEmail(u.email);
    setCollabEmail(u.email);
    await handleAddCollaborator();
    setAddingMemberEmail(null);
  };

  const renderCollaborator = ({ item }: { item: Collaborator }) => {
    const name = item.displayName || item.email;
    const initial = (name || "?").charAt(0).toUpperCase();
    return (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1
      }}>
        {item.picture ? (
          <Image source={{ uri: item.picture }} style={{ width: 42, height: 42, borderRadius: 21, marginRight: 12, backgroundColor: "#eee" }} />
        ) : (
          <View style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#6366F1",
            marginRight: 12,
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{initial}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", color: "#111" }}>{name}</Text>
          <Text style={{ color: "#666", fontSize: 12 }}>{item.email}</Text>
          {item.role && <Text style={{ color: "#6D28D9", fontSize: 11, marginTop: 2 }}>{item.role}</Text>}
        </View>
        {item.createdAt && (
          <Text style={{ color: "#999", fontSize: 10 }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1, backgroundColor: "#F3F4F6" }}>
        <View style={{ paddingTop: 60, paddingHorizontal: 20 }}>
          <Button title="⬅ Back" onPress={() => router.back()} />
          <Text style={{ marginTop: 20, fontSize: 22, fontWeight: "700" }}>Account Collaborators</Text>

          {/* Add collaborator */}
          <View style={{ marginTop: 24, backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#111827" }}>Add Collaborator</Text>
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
              Invite a user by email to share and manage this account.
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  backgroundColor: "#F9FAFB",
                  color: "#111827",
                }}
                placeholder="user@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={collabEmail}
                onChangeText={setCollabEmail}
                editable={!adding}
              />
              <TouchableOpacity
                onPress={handleAddCollaborator}
                disabled={adding}
                style={{
                  marginLeft: 8,
                  backgroundColor: "#8B5CF6",
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 8,
                  opacity: adding ? 0.6 : 1
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>{adding ? "..." : "Add"}</Text>
              </TouchableOpacity>
            </View>

            {(suggestLoading || suggestions.length > 0) && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  overflow: "hidden",
                  marginBottom: 6
                }}
              >
                {suggestLoading && suggestions.length === 0 ? (
                  <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
                    <ActivityIndicator size="small" />
                    <Text style={{ marginLeft: 8, fontSize: 12, color: "#6B7280" }}>Searching...</Text>
                  </View>
                ) : (
                  suggestions.map(u => (
                    <TouchableOpacity
                      key={u.email}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#F1F5F9"
                      }}
                      onPress={() => handleSelectSuggestion(u)}
                      disabled={adding && addingMemberEmail === u.email}
                      activeOpacity={0.6}
                    >
                      {addingMemberEmail === u.email ? (
                        <ActivityIndicator size="small" style={{ width: 32 }} />
                      ) : u.picture ? (
                        <Image source={{ uri: u.picture }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                      ) : (
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: "#F1F5F9",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text style={{ fontSize: 12, color: "#6B7280" }}>@</Text>
                        </View>
                      )}
                      <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ fontSize: 14, color: "#111827", fontWeight: "500" }}>{u.email}</Text>
                        {!!u.displayName && (
                          <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{u.displayName}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {collabError && (
              <Text style={{ color: "#DC2626", fontSize: 12, marginBottom: 4 }}>{collabError}</Text>
            )}
            {collabSuccess && (
              <Text style={{ color: "#10B981", fontSize: 12, marginBottom: 4 }}>{collabSuccess}</Text>
            )}
            <TouchableOpacity
              onPress={fetchCollaborators}
              style={{
                alignSelf: "flex-start",
                marginTop: 4,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 6,
                backgroundColor: "#F3F4F6"
              }}
              activeOpacity={0.6}
            >
              <Text style={{ fontSize: 12, color: "#374151", fontWeight: "500" }}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {/* Collaborator list */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 10 }}>
              Current Collaborators
            </Text>
            {loading ? (
              <ActivityIndicator color="#6366F1" />
            ) : error ? (
              <Text style={{ color: "#DC2626" }}>{error}</Text>
            ) : (
              <FlatList
                data={collaborators}
                keyExtractor={(item, idx) => item.id || item.email || String(idx)}
                renderItem={renderCollaborator}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}>
                    No collaborators yet.
                  </Text>
                }
                contentContainerStyle={{ paddingVertical: 4, paddingBottom: 40 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
