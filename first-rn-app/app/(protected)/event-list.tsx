import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "../../config";
import { useRouter } from "expo-router";
import { Search, Trash2 } from "lucide-react-native";

type EventItem = {
  id: string;
  name: string;
  createdAt: string;
  votesCount: number;
  guestsCount: number;
  guestLink?: string;
};

export default function EventListScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "progress">("new");
  const router = useRouter();

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      try {
        const res = await fetch(`${API_URL}/events/mine`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setEvents(data);
      } catch (e) {
        Alert.alert("Error", "Failed to load your events.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const filtered = useMemo(() => {
    const byQuery = events.filter((e) =>
      e.name.toLowerCase().includes(q.trim().toLowerCase())
    );
    const withRate = byQuery.map((e) => ({
      ...e,
      rate:
        e.guestsCount > 0
          ? Math.round((e.votesCount / e.guestsCount) * 100)
          : 0,
    }));
    if (sort === "new")
      return withRate.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
    if (sort === "old")
      return withRate.sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
      );
    return withRate.sort((a, b) => b.rate - a.rate);
  }, [events, q, sort]);

  const confirmDelete = (eventId: string) => {
    Alert.alert("Delete event?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await Promise.resolve(
              localStorage?.getItem?.("token")
            );
            const res = await fetch(`${API_URL}/events/${eventId}`, {
              method: "DELETE",
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error();
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
          } catch {
            Alert.alert("Error", "Failed to delete event");
          }
        },
      },
    ]);
  };

  const viewLinks = (id: string) => {
    router.push(`/share?id=${encodeURIComponent(id)}`);
  };

  const viewVotes = (ev: EventItem) => {
    if (!ev.guestLink) return;
    // sur mobile, on va plutôt renvoyer vers vote screen si tu l’as en RN
    router.push(
      `/vote?id=${ev.id}&guest=${encodeURIComponent(ev.guestLink.split("/guest/")[1])}`
    );
  };

  if (loading)
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  if (events.length === 0) {
    return (
      <ScrollView className="flex-1 bg-white px-6 pt-16">
        <View className="items-center justify-center">
          <Text className="text-2xl font-bold mb-2">My Events</Text>
          <Text className="text-gray-500 mb-6">
            You haven’t created any events yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/event/create-event")}
            className="bg-black rounded-full px-5 py-3"
          >
            <Text className="text-white font-semibold">
              Create your first event
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold">My Events</Text>
      </View>

      {/* Search + sort */}
      <View className="gap-2 mb-4">
        <View className="relative">
          <Search
            size={16}
            color="#6b7280"
            style={{ position: "absolute", left: 8, top: 12 }}
          />
          <TextInput
            placeholder="Search an event…"
            value={q}
            onChangeText={setQ}
            className="pl-8 pr-3 py-3 border rounded-xl"
          />
        </View>

        <View className="flex-row gap-2">
          {(["new", "old", "progress"] as const).map((k) => (
            <TouchableOpacity
              key={k}
              onPress={() => setSort(k)}
              className={`px-3 py-2 rounded-full border ${sort === k ? "bg-black" : "bg-white"}`}
            >
              <Text className={sort === k ? "text-white" : "text-black"}>
                {k === "new"
                  ? "Newest"
                  : k === "old"
                    ? "Oldest"
                    : "Highest progress"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="gap-4">
        {filtered.map((event) => {
          const rate =
            event.guestsCount > 0
              ? Math.round((event.votesCount / event.guestsCount) * 100)
              : 0;
          const rateColor =
            rate === 100
              ? "bg-green-600"
              : rate >= 50
                ? "bg-yellow-500"
                : "bg-red-500";

          return (
            <View key={event.id} className="border rounded-xl p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold">{event.name}</Text>
                  <Text className="text-xs text-gray-500">
                    Created on {new Date(event.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => confirmDelete(event.id)}>
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-2 mt-3">
                <View className="px-2 py-1 rounded-full border">
                  <Text className="text-xs">
                    {event.votesCount}/{event.guestsCount} voted
                  </Text>
                </View>
                <View className={`px-2 py-1 rounded ${rateColor}`}>
                  <Text className="text-xs text-white">{rate}% done</Text>
                </View>
              </View>

              <View className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <View
                  className={`h-2 ${rateColor}`}
                  style={{ width: `${rate}%` }}
                />
              </View>

              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity
                  className="flex-1 bg-black rounded-full py-3"
                  onPress={() => viewLinks(event.id)}
                >
                  <Text className="text-center text-white font-semibold">
                    View Links
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 border rounded-full py-3"
                  onPress={() => viewVotes(event)}
                  disabled={!event.guestLink}
                >
                  <Text className="text-center font-semibold">
                    {event.guestLink ? "View Votes" : "No guest link"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
