import React, { useEffect, useState, useCallback } from "react";
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

export default function EventListScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      Alert.alert("Error", "Could not load your events.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/events/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete");
            Alert.alert("Deleted", "Event has been deleted.");
            fetchEvents();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Unable to delete event.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading your events...</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          No events yet 👀
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/create-event")}
          className="bg-black px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">
            Create your first event
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-8"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-3xl font-bold mb-4">My Events</Text>
      <Text className="text-gray-500 mb-6">
        You have {events.length} active event{events.length > 1 ? "s" : ""}.
      </Text>

      <View className="space-y-4">
        {events.map((event) => (
          <View
            key={event.id}
            className="border border-gray-200 rounded-2xl p-5 bg-gray-50"
          >
            <Text className="text-lg font-semibold mb-1">{event.name}</Text>
            {event.description ? (
              <Text className="text-gray-500 mb-2">{event.description}</Text>
            ) : null}

            <Text className="text-xs text-gray-400 mb-1">
              Guests: {event.guests?.length ?? 0} • Options:{" "}
              {event.options?.length ?? 0}
            </Text>

            {event.votingDeadline && (
              <Text className="text-xs text-red-600 font-medium mb-2">
                Voting closes on:{" "}
                {new Date(event.votingDeadline).toLocaleString()}
              </Text>
            )}

            <View className="flex-row justify-between mt-3">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(protected)/share",
                    params: { id: event.id },
                  })
                }
                className="border border-gray-300 rounded-full px-5 py-2"
              >
                <Text className="text-sm font-semibold text-gray-700">
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(event.id)}
                className="border border-red-400 rounded-full px-5 py-2"
              >
                <Text className="text-sm font-semibold text-red-500">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
