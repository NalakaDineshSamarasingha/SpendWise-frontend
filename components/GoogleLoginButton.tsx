import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

const BACKEND_URL = "https://spendwise-backend-2nvv.onrender.com";

export default function GoogleLoginButton({ onLogin }: { onLogin: (token: string) => void }) {
  const redirectUri = makeRedirectUri({
    scheme: "client", // must match app.json
  });

  const loginWithGoogle = async () => {
    const authUrl = `${BACKEND_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const token = url.searchParams.get("token");
      if (token) {
        onLogin(token);
      }
    } else {
      console.log("Login cancelled or failed:", result);
    }
  };

  return (
    <TouchableOpacity style={styles.googleButton} onPress={loginWithGoogle}>
      <View style={styles.googleButtonContent}>
        {/* Google Logo */}
        <View style={styles.googleIconContainer}>
          <Text style={styles.googleIcon}>G</Text>
        </View>
        
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});