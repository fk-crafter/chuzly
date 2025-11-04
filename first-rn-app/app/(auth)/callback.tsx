import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";
import Toast from "react-native-toast-message";

export default function OAuthCallback() {
  const router = useRouter();
  const { token } = useLocalSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Missing token",
          text2: "Please try again",
        });
        return;
      }

      try {
        await AsyncStorage.setItem("token", String(token));

        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();

        if (!user.hasOnboarded) {
          router.replace("/(protected)/onboarding");
        } else {
          router.replace("/(protected)/overview");
        }
      } catch (err) {
        console.error(err);
        Toast.show({
          type: "error",
          text1: "Login error",
          text2: "Could not complete OAuth login",
        });
        router.replace("/(auth)/login");
      }
    };

    handleAuth();
  }, [token, router]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="black" />
      <Text className="text-gray-600 mt-3">Finishing login...</Text>
    </View>
  );
}
