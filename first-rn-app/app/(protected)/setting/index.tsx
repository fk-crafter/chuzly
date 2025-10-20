import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading your settings...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600 mb-3">Failed to load profile 😕</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-black px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const initials =
    profile.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-3xl font-bold mb-8 text-center">Settings ⚙️</Text>

      <View className="items-center mb-8">
        <View
          className={`w-24 h-24 rounded-full items-center justify-center bg-gray-200`}
        >
          <Text className="text-2xl font-bold text-gray-800">{initials}</Text>
        </View>
        <Text className="text-lg font-semibold mt-3">{profile.name}</Text>
        <Text className="text-gray-500">{profile.email}</Text>

        {profile.plan === "PRO" && (
          <View className="mt-2 px-4 py-1 bg-yellow-300 rounded-full">
            <Text className="font-semibold text-black">PRO PLAN</Text>
          </View>
        )}
      </View>

      <View className="space-y-4">
        <SettingItem
          label="Edit Profile"
          onPress={() => router.push("/(protected)/setting/profile")}
        />
        <SettingItem
          label="Choose Plan"
          onPress={() => router.push("/(protected)/setting/choose-plan")}
        />
        <SettingItem
          label="Subscription"
          onPress={() => router.push("/(protected)/setting/subscription")}
        />
      </View>

      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.clear();
          router.push("/(auth)/login");
        }}
        className="mt-10 bg-red-600 py-4 rounded-full"
      >
        <Text className="text-white text-center font-semibold">Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border border-gray-300 rounded-xl px-5 py-4"
    >
      <Text className="text-base font-semibold text-gray-800">{label}</Text>
    </TouchableOpacity>
  );
}
