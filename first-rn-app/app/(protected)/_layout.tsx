import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HamburgerMenu from "@/components/HamburgerMenu"; // ✅ importe ton menu ici

export default function ProtectedLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
      }

      setCheckingAuth(false);
    };

    verifyAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* ✅ Menu visible partout */}
      <HamburgerMenu />

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
        <Stack.Screen name="event" />
      </Stack>
    </View>
  );
}
