import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import {jwtDecode} from "jwt-decode";

const BACKEND_URL = "https://spendwise-backend-2nvv.onrender.com";

type JwtPayload = {
  id: string;
  name: string;
  email: string;
  exp: number;
};

export default function LoginScreen() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const redirectUri = makeRedirectUri({
    scheme: "myapp", // must match your app.json
  });

  const loginWithGoogle = async () => {
    const authUrl = `${BACKEND_URL}/auth/google?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const jwt = url.searchParams.get("token");

      if (jwt) {
        setToken(jwt);
        try {
          const decoded: JwtPayload = jwtDecode(jwt);
          setUser(decoded);
        } catch (err) {
          console.log("Failed to decode token:", err);
        }
      }
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Button title="Sign in with Google" onPress={loginWithGoogle} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Login Successful</Text>
      <Text style={styles.text}>Name: {user.name}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.tokenTitle}>JWT:</Text>
      <Text style={styles.token}>{token}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  tokenTitle: {
    fontWeight: "bold",
    marginTop: 15,
  },
  token: {
    fontSize: 12,
    color: "#555",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
    textAlign: "center",
  },
});
