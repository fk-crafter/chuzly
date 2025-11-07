import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";

export default function ShareEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [copied, setCopied] = useState<string | null>(null);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        throw new Error("No token");
      }

      const res = await fetch(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch event");
      return res.json();
    },
    enabled: !!id,
    retry: false,
  });

  if (error) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Could not load event details.",
    });
  }

  const handleCopy = async (text: string, guest?: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(guest || "all");
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading event data...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Event not found 😢</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Text className="text-3xl font-bold mb-8 text-center">
        Share your event 🎉
      </Text>

      <View className="mb-8">
        <Text className="text-xl font-semibold mb-2">{event.name}</Text>
        {event.options?.map((opt: any, i: number) => (
          <View key={i} className="border border-gray-200 rounded-xl p-4 mb-3">
            <Text className="font-semibold text-lg">{opt.name}</Text>

            {opt.datetime && (
              <>
                <Text className="text-gray-600 mt-1">
                  📅 {new Date(opt.datetime).toLocaleDateString()}
                </Text>
                <Text className="text-gray-600">
                  🕒{" "}
                  {new Date(opt.datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </>
            )}
            {opt.price && (
              <Text className="text-gray-600 mt-1">💰 ${opt.price}</Text>
            )}
          </View>
        ))}
      </View>

      <Text className="text-lg font-semibold mb-4">Guest links</Text>

      <TouchableOpacity
        onPress={() => {
          const allLinks = event.guests
            .map(
              (guest: any) =>
                `${guest.nickname}: ${API_URL.replace(
                  ":5001",
                  ":3000"
                )}/vote?id=${event.id}&guest=${encodeURIComponent(
                  guest.nickname
                )}`
            )
            .join("\n\n");
          handleCopy(allLinks);
        }}
        className="bg-black py-4 rounded-full mb-4"
      >
        <Text className="text-white text-center font-semibold">
          {copied === "all" ? "Copied!" : "Copy all guest links"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push(
            `/(protected)/vote?id=${event.id}&guest=${encodeURIComponent(
              event.guests?.[0]?.nickname || "guest"
            )}`
          )
        }
        className="bg-blue-600 py-4 rounded-full mb-8"
      >
        <Text className="text-white text-center font-semibold">
          Go to Vote Page
        </Text>
      </TouchableOpacity>

      {event.guests?.map((guest: any, i: number) => {
        const voteUrl = `${API_URL.replace(
          ":5001",
          ":3000"
        )}/vote?id=${event.id}&guest=${encodeURIComponent(guest.nickname)}`;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => handleCopy(voteUrl, guest.nickname)}
            className="border border-gray-300 rounded-full py-3 px-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-gray-800 font-medium">
              {guest.nickname}&apos;s link
            </Text>
            <Text className="text-sm text-gray-500">
              {copied === guest.nickname ? "✅" : "📋"}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        onPress={() => router.push("/(protected)/event-list")}
        className="mt-10 py-4 border border-gray-300 rounded-full"
      >
        <Text className="text-center text-gray-700 font-semibold">
          Back to Events
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
