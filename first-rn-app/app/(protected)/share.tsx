import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL } from "@/config";

export default function ShareEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load event");

      const data = await res.json();
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event:", err);
      Alert.alert("Error", "Could not load event details.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id, fetchEvent]);

  const inviteLink = `${API_URL.replace(
    ":5001",
    ":3000"
  )}/vote?id=${id}&guest=YourName`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteLink);
    Alert.alert("Copied", "The invitation link has been copied!");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my event "${event?.name}" on Chuzly: ${inviteLink}`,
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Event not found 😢</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-3xl font-bold mb-3">{event.name}</Text>
      <Text className="text-gray-500 mb-6">
        Share this event with your guests 👇
      </Text>

      {/* Link Box */}
      <View className="bg-gray-100 border border-gray-300 rounded-2xl p-4 mb-4">
        <Text
          selectable
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-gray-800 text-sm"
        >
          {inviteLink}
        </Text>
      </View>

      <View className="flex-row justify-between gap-3 mb-8">
        <TouchableOpacity
          onPress={handleCopy}
          className="flex-1 bg-black py-4 rounded-full"
        >
          <Text className="text-white text-center font-semibold">
            Copy Link
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          className="flex-1 border border-black py-4 rounded-full"
        >
          <Text className="text-black text-center font-semibold">Share</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-semibold mb-3">Event Details</Text>

      <View className="space-y-2 mb-4">
        <Text className="text-gray-700">
          📍 {event.location || "No location"}
        </Text>
        <Text className="text-gray-700">
          💰 {event.price ? `$${event.price}` : "Free"}
        </Text>
        <Text className="text-gray-700">
          🗓 Options: {event.options?.length || 0}
        </Text>
        <Text className="text-gray-700">
          👥 Guests: {event.guests?.length || 0}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(protected)/event-list")}
        className="mt-8 py-4 border border-gray-300 rounded-full"
      >
        <Text className="text-gray-700 text-center font-semibold">
          Back to Events
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
