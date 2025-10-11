import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="overview" />
      <Stack.Screen name="event-list" />
      <Stack.Screen name="share" />
      <Stack.Screen name="setting/index" />
      <Stack.Screen name="setting/subscription" />
      <Stack.Screen name="setting/profile" />
      <Stack.Screen name="setting/choose-plan" />
    </Stack>
  );
}
