import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Cog,
  User,
  CreditCard,
  Star,
  LogOut,
  ChevronRight,
  MessageCircle,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";

export default function SettingsScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        throw new Error("No token found");
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-500 mt-4">Loading settings...</Text>
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
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
    >
      <View className="flex-row items-center justify-center mb-8">
        <Cog size={26} color="black" strokeWidth={2.2} />
        <Text className="text-3xl font-bold text-gray-900 ml-2">Settings</Text>
      </View>

      <View className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mb-8">
        <View className="items-center">
          <View
            className={`w-20 h-20 rounded-full items-center justify-center ${
              profile.avatarColor || "bg-gray-200"
            }`}
          >
            <Text className="text-2xl font-bold text-gray-800">{initials}</Text>
          </View>
          <Text className="text-lg font-semibold mt-3">{profile.name}</Text>
          <Text className="text-gray-500">{profile.email}</Text>

          {profile.plan === "PRO" && (
            <View className="mt-2 px-4 py-1 bg-yellow-400/80 rounded-full">
              <Text className="font-semibold text-black">PRO PLAN</Text>
            </View>
          )}
        </View>
      </View>

      <View className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <SettingItem
          label="Edit Profile"
          icon={<User size={20} color="#111" />}
          onPress={() => router.push("/(protected)/setting/profile")}
        />
        <SettingItem
          label="Choose Plan"
          icon={<Star size={20} color="#111" />}
          onPress={() => router.push("/(protected)/setting/choose-plan")}
        />
        <SettingItem
          label="Subscription"
          icon={<CreditCard size={20} color="#111" />}
          onPress={() => router.push("/(protected)/setting/subscription")}
        />
      </View>

      <View className="mt-6 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <SettingItem
          label="Send Feedback"
          icon={<MessageCircle size={20} color="#111" />}
          onPress={() => router.push("/")}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          Alert.alert("Log out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Log out",
              style: "destructive",
              onPress: async () => {
                await AsyncStorage.removeItem("token");
                router.replace("/(auth)/login");
              },
            },
          ]);
        }}
        className="mt-8 flex-row items-center justify-center bg-red-600 py-4 rounded-full shadow-sm"
      >
        <LogOut size={20} color="white" />
        <Text className="text-white text-base font-semibold ml-2">Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100"
    >
      <View className="flex-row items-center">
        <View className="mr-3">{icon}</View>
        <Text className="text-base font-semibold text-gray-800">{label}</Text>
      </View>
      <ChevronRight size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}
