import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth-store";

export default function OverviewScreen() {
  const router = useRouter();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const token = useAuthStore.getState().token;

      if (!token) {
        router.push("/(auth)/login");
        throw new Error("Missing token");
      }

      const res = await fetch(`${API_URL}/events/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load stats");

      return res.json();
    },
    refetchOnWindowFocus: true,
    retry: false,
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-white px-6 py-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            className="h-20 bg-gray-200 rounded-3xl mb-4 animate-pulse"
          />
        ))}
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-xl font-semibold text-gray-800 mb-4">
          Something went wrong 😕
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Create a new event</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
    >
      <View className="mb-10">
        <Text className="text-4xl font-extrabold text-center tracking-tight">
          Overview
        </Text>

        <Text className="text-gray-500 text-center mt-1 text-base">
          Your planning activity
        </Text>
      </View>

      <View className="gap-2">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          color="#6366F1"
          icon="calendar-outline"
        />

        <StatCard
          title="Total Votes"
          value={stats.totalVotes}
          color="#10B981"
          icon="checkmark-done-outline"
        />

        <StatCard
          title="Total Guests"
          value={stats.totalGuests}
          color="#F59E0B"
          icon="people-outline"
        />

        <StatCard
          title="Upcoming Deadlines"
          value={`${stats.upcomingEvents} due soon`}
          color="#EF4444"
          icon="alert-circle-outline"
        />
      </View>

      <View className="mt-14 space-y-4">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black py-5 mb-3 rounded-full shadow-md active:opacity-80"
        >
          <Text className="text-white font-semibold text-center text-base">
            Create New Event
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/event-list")}
          className="border border-gray-300 py-5 rounded-full active:opacity-70"
        >
          <Text className="text-black font-semibold text-center text-base">
            View My Events
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: any;
}) {
  return (
    <View
      className="p-6 rounded-3xl border border-gray-100 shadow-sm bg-white flex-row justify-between items-center"
      style={{ elevation: 2 }}
    >
      <View>
        <Text className="text-gray-500 text-sm">{title}</Text>
        <Text className="text-3xl font-extrabold mt-1">{value}</Text>
      </View>

      <View
        className="w-14 h-14 rounded-2xl justify-center items-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={28} color={color} />
      </View>
    </View>
  );
}
