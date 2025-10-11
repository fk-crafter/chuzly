import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, Clock, DollarSign, Copy, Check } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { API_URL } from "../../config";

export default function ShareEventScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const eventId = params.id ?? "";
  const [event, setEvent] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        setEvent(await res.json());
      } catch {
        Alert.alert("Error", "Failed to load event data.");
      }
    })();
  }, [eventId]);

  const handleCopyAll = async () => {
    if (!event) return;
    const linksText = event.guests
      .map(
        (guest: any) =>
          `${guest.nickname}: ${API_URL.replace(
            "/api",
            ""
          )}/vote?id=${event.id}&guest=${encodeURIComponent(guest.nickname)}`
      )
      .join("\n\n");

    await Clipboard.setStringAsync(linksText);
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
    Alert.alert("Copied", "All guest links copied!");
  };

  const handleCopy = async (guest: string) => {
    if (!event) return;
    const voteUrl = `${API_URL.replace(
      "/api",
      ""
    )}/vote?id=${event.id}&guest=${encodeURIComponent(guest)}`;
    await Clipboard.setStringAsync(voteUrl);
    setCopied(guest);
    setTimeout(() => setCopied(null), 2000);
    Alert.alert("Copied", `${guest}'s link copied!`);
  };

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading event...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      <Text className="text-2xl font-bold mb-6 text-center">
        Share your event
      </Text>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3 text-center">
          {event.name}
        </Text>
        {event.options.map((opt: any, i: number) => (
          <View key={i} className="border rounded-xl p-4 mb-3">
            <Text className="font-semibold mb-2">{opt.name}</Text>
            {opt.datetime && (
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#111" />
                <Text className="ml-2 text-sm text-gray-600">
                  {new Date(opt.datetime).toLocaleDateString()}
                </Text>
              </View>
            )}
            {opt.datetime && (
              <View className="flex-row items-center mb-1">
                <Clock size={16} color="#111" />
                <Text className="ml-2 text-sm text-gray-600">
                  {new Date(opt.datetime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
            {opt.price && (
              <View className="flex-row items-center">
                <DollarSign size={16} color="#111" />
                <Text className="ml-2 text-sm text-gray-600">${opt.price}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3 text-center">
          Guest links
        </Text>

        <TouchableOpacity
          onPress={handleCopyAll}
          className="bg-black py-4 rounded-full mb-5"
        >
          <Text className="text-white text-center font-semibold">
            {copied === "all" ? "Copied!" : "Copy all guest links"}
          </Text>
        </TouchableOpacity>

        {event.guests.map((guest: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleCopy(guest.nickname)}
            className="flex-row justify-between items-center border rounded-full px-4 py-3 mb-3"
          >
            <Text className="font-medium">{guest.nickname}&apos;s link</Text>
            {copied === guest.nickname ? (
              <Check size={18} color="green" />
            ) : (
              <Copy size={18} color="#333" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-center gap-3">
        <TouchableOpacity
          onPress={() => router.push("/event/create-event")}
          className="border rounded-full px-5 py-3"
        >
          <Text className="font-medium">Create new event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/overview")}
          className="bg-black rounded-full px-5 py-3"
        >
          <Text className="text-white font-semibold">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
