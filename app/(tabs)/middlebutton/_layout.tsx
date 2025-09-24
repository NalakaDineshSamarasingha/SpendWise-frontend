// app/(tabs)/profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Plan Trip" }} />
      <Stack.Screen name="debt" options={{ title: "Debt Manage" }} />
      <Stack.Screen name="settings" options={{ title: "Save Goal" }} />
    </Stack>
  );
}
