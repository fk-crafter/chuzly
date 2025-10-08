import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../../config";

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalEvents: number;
    totalVotes: number;
    totalGuests: number;
    upcomingEvents: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }

      try {
        const userRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await userRes.json();

        if (!user?.hasOnboarded) {
          router.push("/onboarding");
          return;
        }

        const res = await fetch(`${API_URL}/events/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-gray-500 mt-3">Loading your stats...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="text-lg text-gray-600 mb-4">
          Couldn’t load your dashboard 😢
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-black py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">Go to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-5 py-10 mt-14">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold mb-2">Welcome back 👋</Text>
        <Text className="text-gray-500 text-center">
          Ready to create a new event or manage your current ones?
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-center gap-3 mb-8">
        <TouchableOpacity
          onPress={() => router.push("/event")}
          className="bg-black py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">Create new event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/event")}
          className="border border-gray-300 py-3 px-6 rounded-full"
        >
          <Text className="font-semibold text-gray-800">View my events</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-4">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Total Votes" value={stats.totalVotes} />
        <StatCard title="Total Guests" value={stats.totalGuests} />
        <StatCard
          title="Upcoming Deadlines"
          value={`${stats.upcomingEvents} events ending soon`}
        />
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
      <Text className="text-base font-semibold text-gray-700">{title}</Text>
      <Text className="text-3xl font-bold mt-2 text-black">{value}</Text>
    </View>
  );
}
