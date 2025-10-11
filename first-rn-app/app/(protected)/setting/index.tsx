import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { User, CreditCard } from "lucide-react-native";
import { API_URL } from "../../../config";

export default function SettingsScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    name: string;
    plan: string;
    trialEndsAt?: string | null;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProfile(await res.json());
    };
    load();
  }, []);

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-3xl font-bold text-center mb-8">
        Account overview
      </Text>

      <View className="gap-4">
        <TouchableOpacity
          onPress={() => router.push("/setting/profile")}
          className="border rounded-2xl p-4 flex-row items-center gap-3"
        >
          <View className="border rounded-xl p-2">
            <User size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold">Profile settings</Text>
            <Text className="text-sm text-gray-500">
              Update your personal information, name & avatar.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/setting/subscription")}
          className="border rounded-2xl p-4 flex-row items-center gap-3"
        >
          <View className="border rounded-xl p-2">
            <CreditCard size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold">Subscription</Text>
            <Text className="text-sm text-gray-500">
              {profile.plan === "TRIAL" && profile.trialEndsAt
                ? `Trial until ${new Date(profile.trialEndsAt).toLocaleDateString()}`
                : `Current plan: ${profile.plan}`}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="border rounded-2xl p-4">
          <Text className="font-semibold text-lg mb-1">Plan details</Text>
          <Text className="text-sm text-gray-500 mb-4">
            You are currently on the{" "}
            <Text className="font-medium">{profile.plan}</Text> plan.
          </Text>
          <TouchableOpacity
            className="bg-black rounded-md px-4 py-3"
            onPress={() => router.push("/setting/subscription")}
          >
            <Text className="text-white text-center">Manage subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
