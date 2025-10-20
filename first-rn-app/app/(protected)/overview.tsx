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

export default function OverviewScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalEvents: number;
    totalVotes: number;
    totalGuests: number;
    upcomingEvents: number;
  } | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/events/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading your dashboard...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Something went wrong 😕
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Create a new event</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold mb-6 text-center">
        Welcome back 👋
      </Text>
      <Text className="text-gray-500 text-center mb-8">
        Here’s a quick overview of your activity
      </Text>

      <View className="space-y-4">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Total Votes" value={stats.totalVotes} />
        <StatCard title="Total Guests" value={stats.totalGuests} />
        <StatCard
          title="Upcoming Deadlines"
          value={`${stats.upcomingEvents} ending soon`}
        />
      </View>

      <View className="mt-10 space-y-4">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black py-4 rounded-full"
        >
          <Text className="text-white font-semibold text-center text-base">
            Create New Event
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/event-list")}
          className="border border-gray-300 py-4 rounded-full"
        >
          <Text className="text-black font-semibold text-center text-base">
            View My Events
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <View className="bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-200">
      <Text className="text-gray-500 text-sm mb-2">{title}</Text>
      <Text className="text-2xl font-bold text-black">{value}</Text>
    </View>
  );
}
