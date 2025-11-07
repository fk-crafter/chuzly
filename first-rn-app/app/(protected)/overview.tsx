import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

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
        throw new Error("No token");
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
      <View className="flex-1 bg-white px-6 py-10">
        <View className="w-48 h-8 bg-gray-200 rounded-md self-center mb-8 animate-pulse" />
        <View className="w-60 h-4 bg-gray-200 rounded-md self-center mb-10 animate-pulse" />

        <View className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              className="bg-gray-200 h-20 rounded-2xl animate-pulse"
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

      <View className="mt-10 space-y-2">
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black py-4 mb-2 rounded-full"
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
