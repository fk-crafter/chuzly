import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL } from "@/config";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

type EventOption = {
  id: string;
  name: string;
  price?: number | null;
  datetime?: string | null;
};

type Guest = {
  nickname: string;
  vote?: { id: string; name: string };
};

type Event = {
  id: string;
  name: string;
  votingDeadline?: string;
  options: EventOption[];
  guests: Guest[];
};

export default function VoteScreen() {
  const router = useRouter();
  const { id, guest } = useLocalSearchParams<{ id?: string; guest?: string }>();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const {
    data: event,
    isLoading,
    refetch,
    error,
  } = useQuery<Event>({
    queryKey: ["event", id, guest],
    queryFn: async () => {
      if (!id || !guest) throw new Error("Missing event or guest info");

      const token = useAuthStore.getState().token;
      if (!token) {
        router.push("/(auth)/login");
        throw new Error("No token");
      }

      const res = await fetch(`${API_URL}/events/${id}/guest/${guest}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch event");
      const data = await res.json();

      const guestData = data.guests.find((g: any) => g.nickname === guest);
      if (guestData?.vote?.id) {
        setSelectedOptionId(guestData.vote.id);
        setHasVoted(true);
      } else {
        setSelectedOptionId(null);
        setHasVoted(false);
      }

      return data;
    },
    retry: false,
  });

  if (error) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Could not load event details.",
    });
  }

  const handleVoteSubmit = async (choice: string | null) => {
    if (!id || !guest) return;

    try {
      const token = useAuthStore.getState().token;
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
        body: JSON.stringify({ choice }),
      });

      if (!res.ok) throw new Error("Vote failed");

      if (choice === null) {
        Toast.show({ type: "success", text1: "Vote canceled" });
      } else if (choice === "unavailable") {
        Toast.show({
          type: "info",
          text1: "Marked as unavailable",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Your vote has been recorded",
        });
      }

      await refetch();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Action failed",
      });
    }
  };

  if (isLoading) {
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

  const votingClosed =
    event.votingDeadline && new Date(event.votingDeadline) < new Date();

  const voteCounts: Record<string, number> = {};
  for (const g of event.guests) {
    const voteId = g.vote?.id;
    if (voteId) {
      voteCounts[voteId] = (voteCounts[voteId] || 0) + 1;
    }
  }

  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0);
  const maxVotes = Math.max(...Object.values(voteCounts), 0);

  return (
    <ScrollView className="flex-1 bg-white px-6 py-10">
      <Text className="text-2xl font-bold mb-2">{event.name}</Text>
      <Text className="text-gray-600 mb-4">
        Hi {guest},{" "}
        {votingClosed
          ? "here are the results 👇"
          : "choose your favorite option 👇"}
      </Text>

      {event.votingDeadline && (
        <Text className="text-red-500 mb-4 font-medium">
          Voting closes on: {new Date(event.votingDeadline).toLocaleString()}
        </Text>
      )}

      {event.options.map((opt: any) => {
        const votes = voteCounts[opt.id] || 0;
        const percentage =
          totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        const isWinning = votes === maxVotes && maxVotes > 0;
        const isLosing = !isWinning && votes > 0;

        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => {
              if (!hasVoted && !votingClosed) setSelectedOptionId(opt.id);
            }}
            className={`border rounded-xl p-4 mb-3 ${
              selectedOptionId === opt.id
                ? "border-black bg-gray-100"
                : "border-gray-300"
            } ${
              votingClosed && isWinning ? "border-green-500 bg-green-100" : ""
            }
              ${votingClosed && isLosing ? "border-red-400 bg-red-50" : ""}`}
          >
            <Text className="font-semibold text-lg mb-1">{opt.name}</Text>

            {opt.datetime && (
              <Text className="text-gray-600">
                📅 {new Date(opt.datetime).toLocaleString()}
              </Text>
            )}
            {opt.price && (
              <Text className="text-gray-600">💰 ${opt.price}</Text>
            )}

            {votingClosed && (
              <Text className="text-sm text-gray-500 mt-2">
                {percentage}% ({votes} vote{votes !== 1 ? "s" : ""})
              </Text>
            )}
          </TouchableOpacity>
        );
      })}

      {!votingClosed && (
        <View className="mt-6 space-y-3">
          {!hasVoted && (
            <>
              <TouchableOpacity
                onPress={() => handleVoteSubmit(selectedOptionId!)}
                disabled={!selectedOptionId}
                className={`py-4 rounded-full ${
                  selectedOptionId ? "bg-black" : "bg-gray-400"
                }`}
              >
                <Text className="text-white text-center font-semibold">
                  Submit Vote
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleVoteSubmit("unavailable")}
                className="py-4 rounded-full border border-gray-300"
              >
                <Text className="text-gray-800 text-center font-semibold">
                  I&apos;m unavailable
                </Text>
              </TouchableOpacity>
            </>
          )}

          {hasVoted && (
            <TouchableOpacity
              onPress={() => handleVoteSubmit(null)}
              className="py-4 rounded-full border border-gray-400"
            >
              <Text className="text-center font-semibold text-gray-800">
                Cancel my vote
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View className="mt-10">
        <Text className="text-xl font-semibold mb-4">Who&apos;s voted?</Text>
        {event.guests.map((g: any, i: number) => (
          <View
            key={i}
            className="flex-row justify-between items-center border-b border-gray-200 py-2"
          >
            <Text className="text-gray-800">{g.nickname}</Text>
            <Text
              className={`text-sm px-3 py-1 rounded-full ${
                g.vote?.name === "Not available"
                  ? "bg-yellow-100 text-yellow-700"
                  : g.vote
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {g.vote?.name === "Not available"
                ? "Unavailable"
                : g.vote
                ? "Voted"
                : "Pending"}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
