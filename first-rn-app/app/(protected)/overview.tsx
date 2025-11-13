import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

export default function OverviewScreen() {
  const router = useRouter();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");

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
        <View className="w-48 h-8 bg-gray-200 rounded-md self-center mb-4 animate-pulse" />
        <View className="w-56 h-4 bg-gray-200 rounded-md self-center mb-10 animate-pulse" />

        <View className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <View
              key={i}
              className="h-20 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </View>

        <View className="mt-10 space-y-4">
          <View className="h-14 bg-gray-200 rounded-full animate-pulse" />
          <View className="h-14 bg-gray-200 rounded-full animate-pulse" />
        </View>
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
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <View className="mb-10">
        <Text className="text-4xl font-extrabold text-center">
          Welcome back 👋
        </Text>

        <Text className="text-gray-500 text-center mt-2">
          Here’s your activity overview
        </Text>
      </View>

      <View className="space-y-4">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Total Votes" value={stats.totalVotes} />
        <StatCard title="Total Guests" value={stats.totalGuests} />
        <StatCard
          title="Upcoming Deadlines"
          value={`${stats.upcomingEvents} ending soon`}
        />
      </View>

      <View className="mt-12 space-y-3">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black py-4 rounded-full shadow-md active:opacity-80"
        >
          <Text className="text-white font-semibold text-center text-base">
            Create New Event
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(protected)/event-list")}
          className="border border-gray-300 py-4 rounded-full active:opacity-70"
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
    <View className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
      <Text className="text-gray-500 text-sm">{title}</Text>
      <Text className="text-3xl font-bold text-black mt-1">{value}</Text>
    </View>
  );
}
