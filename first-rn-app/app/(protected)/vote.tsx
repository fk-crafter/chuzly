import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";

export default function VoteScreen() {
  const router = useRouter();
  const { id, guest } = useLocalSearchParams<{ id?: string; guest?: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!id || !guest) {
      Alert.alert("Error", "Missing event or guest info");
      router.push("/");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events/${id}/guest/${guest}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();
      setEvent(data);

      const guestData = data.guests.find((g: any) => g.nickname === guest);
      if (guestData?.vote?.id) {
        setSelectedOptionId(guestData.vote.id);
        setHasVoted(true);
      } else {
        setHasVoted(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not load event details.");
    } finally {
      setLoading(false);
    }
  }, [id, guest, router]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleVoteSubmit = async () => {
    if (!id || !guest || !selectedOptionId) {
      Alert.alert("Select an option first");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }
      const res = await fetch(`${API_URL}/events/${id}/guest/${guest}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ choice: selectedOptionId }),
      });
      if (!res.ok) throw new Error("Vote failed");
      Alert.alert("Success", "Your vote has been recorded");
      await fetchEvent();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Vote failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 py-10">
      <Text className="text-2xl font-bold mb-4">{event.name}</Text>
      <Text className="mb-4">Hi {guest}, please pick your choice:</Text>
      {event.options.map((opt: any) => (
        <TouchableOpacity
          key={opt.id}
          onPress={() => {
            if (!hasVoted) setSelectedOptionId(opt.id);
          }}
          className={`border rounded-xl p-4 mb-3 ${
            selectedOptionId === opt.id
              ? "border-black bg-gray-100"
              : "border-gray-300"
          }`}
        >
          <Text className="font-semibold text-lg">{opt.name}</Text>
          {opt.price && (
            <Text className="text-gray-600">Price: ${opt.price}</Text>
          )}
          {opt.datetime && (
            <Text className="text-gray-600">
              Date: {new Date(opt.datetime).toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
      ))}

      {!hasVoted && (
        <TouchableOpacity
          onPress={handleVoteSubmit}
          className="bg-black py-4 rounded-full mt-4"
        >
          <Text className="text-white text-center font-semibold">
            Submit Vote
          </Text>
        </TouchableOpacity>
      )}

      {hasVoted && (
        <Text className="mt-4 text-center text-gray-500">
          You’ve already voted. Thank you!
        </Text>
      )}
    </ScrollView>
  );
}
