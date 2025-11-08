import React from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Share2, Trash2 } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Event = {
  id: string;
  name: string;
  description?: string;
  guests?: { nickname: string }[];
  options?: { id: string }[];
  votingDeadline?: string;
};

export default function EventListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        throw new Error("No token");
      }

      const res = await fetch(`${API_URL}/events/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      return data;
    },
    refetchOnWindowFocus: true,
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");

      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Event has been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to delete event.",
      });
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteEventMutation.mutate(id),
      },
    ]);
  };

  if (isLoading) {
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
        {events.map((event: any) => (
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

            <View className="flex-row justify-end gap-3 mt-3">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(protected)/share",
                    params: { id: event.id },
                  })
                }
                className="p-2 rounded-full border border-gray-300"
              >
                <Share2 size={20} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDelete(event.id)}
                className="p-2 rounded-full border border-red-400"
              >
                <Trash2 size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
