// app/(tabs)/profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen name="account" options={{ title: "Account" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="export" options={{ title: "Export Data" }} />
    </Stack>
  );
}
