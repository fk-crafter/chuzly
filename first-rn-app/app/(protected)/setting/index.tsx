import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
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
import { useAuthStore } from "@/store/auth-store";

export default function SettingsScreen() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("NO_TOKEN");

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
    refetchOnWindowFocus: true,
  });

  if (error?.message === "NO_TOKEN") {
    router.replace("/(auth)/login");
  }

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

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      useAuthStore.getState().logout();
      router.replace("/(auth)/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
    >
      <View className="flex-row items-center justify-center mb-8">
        <Cog size={26} color="black" strokeWidth={2.2} />
        <Text className="text-3xl font-bold text-gray-900 ml-2">Settings</Text>
      </View>

      <View className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-8">
        <View className="items-center">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center shadow-lg border-4 border-white 
      ${profile.avatarColor || "bg-gray-200"}`}
          >
            <Text className="text-3xl font-bold text-gray-800">{initials}</Text>
          </View>

          <Text className="text-xl font-semibold mt-4">{profile.name}</Text>
          <Text className="text-gray-500">{profile.email}</Text>

          {profile.plan === "PRO" && (
            <View className="mt-3 px-5 py-1.5 bg-yellow-400/80 rounded-full shadow-sm">
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
          onPress={() => router.push("/(protected)/setting/feedback")}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        disabled={loggingOut}
        className={`mt-8 flex-row items-center justify-center py-4 rounded-full shadow-sm ${
          loggingOut ? "bg-red-400" : "bg-red-600"
        }`}
      >
        {loggingOut ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <LogOut size={20} color="white" />
            <Text className="text-white text-base font-semibold ml-3">
              Log out
            </Text>
          </>
        )}
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
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={`flex-row items-center justify-between px-5 py-5 border-b border-gray-100
        ${pressed ? "bg-gray-100" : "bg-white"}`}
    >
      <View className="flex-row items-center">
        <View className="mr-3 opacity-90">{icon}</View>
        <Text className="text-base font-semibold text-gray-900">{label}</Text>
      </View>

      <ChevronRight size={22} color="#6b7280" strokeWidth={2.2} />
    </TouchableOpacity>
  );
}
