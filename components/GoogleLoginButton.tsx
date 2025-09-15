import React from "react";
import { Button } from "react-native";
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

  return <Button title="Sign in with Google" onPress={loginWithGoogle} />;
}
