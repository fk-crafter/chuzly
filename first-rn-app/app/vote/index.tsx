// app/vote/index.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import ChatBox from "../../components/ChatBox";
import { Lock } from "lucide-react-native";

type EventOption = {
  id: string;
  name: string;
  price?: number | null;
  datetime?: string | null;
};

type Guest = {
  nickname: string;
  vote?: { id: string; name: string } | null;
};

type EventData = {
  id: string;
  name: string;
  votingDeadline?: string | null;
  options: EventOption[];
  guests: Guest[];
};

export default function VoteScreen() {
  const params = useLocalSearchParams<{ id?: string; guest?: string }>();
  const eventId = params.id ?? "";
  const guest = params.guest ?? "";
  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAllowedToChat, setIsAllowedToChat] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // récupérer userId éventuellement stocké
  useEffect(() => {
    AsyncStorage.getItem("userId").then((v) => {
      if (v) setUserId(v);
    });
  }, []);

  const fetchEvent = useCallback(async () => {
    if (!eventId || !guest) return;
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/guest/${guest}`);
      const data: EventData = await res.json();

      const currentGuest = data.guests.find((g) => g.nickname === guest);
      const currentVote = currentGuest?.vote;

      // injecter "Not available" dans options si nécessaire (comme côté web)
      if (
        currentVote?.name === "Not available" &&
        !data.options.find((opt) => opt.id === currentVote.id)
      ) {
        data.options.push({
          id: currentVote.id,
          name: "Not available",
          price: null,
          datetime: null,
        });
      }

      setEvent(data);
      if (currentVote?.id) {
        setSelectedOption(currentVote.id);
        setHasVoted(true);
      } else {
        setSelectedOption(null);
        setHasVoted(false);
      }
    } catch (err) {
      console.error("Failed to fetch event", err);
      Alert.alert("Error", "Failed to load event.");
    }
  }, [eventId, guest]);

  const checkChatAccess = useCallback(async () => {
    if (!eventId) return;
    try {
      const res = await fetch(`${API_URL}/events/${eventId}/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest, userId }),
      });
      const { allowed } = await res.json();
      setIsAllowedToChat(allowed === true);
    } catch {
      setIsAllowedToChat(false);
    }
  }, [eventId, guest, userId]);

  useEffect(() => {
    fetchEvent();
    checkChatAccess();
  }, [fetchEvent, checkChatAccess]);

  // refresh périodique (10s)
  useEffect(() => {
    const t = setInterval(fetchEvent, 10000);
    return () => clearInterval(t);
  }, [fetchEvent]);

  const votingClosed = useMemo(() => {
    if (!event?.votingDeadline) return false;
    return new Date(event.votingDeadline) < new Date();
  }, [event]);

  // compte des votes
  const { voteCounts, totalVotes, maxVotes } = useMemo(() => {
    const counts: Record<string, number> = {};
    if (event?.guests) {
      for (const g of event.guests) {
        const id = g.vote?.id;
        if (id) counts[id] = (counts[id] || 0) + 1;
      }
    }
    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    const max = Math.max(...Object.values(counts), 0);
    return { voteCounts: counts, totalVotes: total, maxVotes: max };
  }, [event]);

  const handleVote = async () => {
    if (!eventId || !guest) return;
    try {
      await fetch(`${API_URL}/events/${eventId}/guest/${guest}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: selectedOption }),
      });
      Alert.alert("Success", "Vote submitted!");
      await fetchEvent();
    } catch (err) {
      console.error("Vote error", err);
      Alert.alert("Error", "Vote failed.");
    }
  };

  const handleCancelVote = async () => {
    if (!eventId || !guest) return;
    try {
      await fetch(`${API_URL}/events/${eventId}/guest/${guest}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: null }),
      });
      Alert.alert("Success", "Vote canceled");
      await fetchEvent();
    } catch (err) {
      console.error("Cancel vote error", err);
      Alert.alert("Error", "Failed to cancel.");
    }
  };

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-5 pt-12"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Titre + intro */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold">{event.name}</Text>
        <Text className="text-gray-500 mt-1">
          Hi {guest},{" "}
          {votingClosed
            ? "here are the results 👇"
            : "choose your favorite option 👇"}
        </Text>

        {!!event.votingDeadline && (
          <Text className="text-red-600 font-medium mt-2">
            Voting closes on: {new Date(event.votingDeadline).toLocaleString()}
          </Text>
        )}
      </View>

      {/* Options */}
      <View className="space-y-3">
        {event.options.map((opt) => {
          const votes = voteCounts[opt.id] || 0;
          const percentage =
            totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isWinning = votes === maxVotes && maxVotes > 0;
          const isSelected = selectedOption === opt.id;

          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.9}
              onPress={() => {
                if (votingClosed) return;
                setSelectedOption((prev) => (prev === opt.id ? null : opt.id));
              }}
              className={[
                "rounded-xl border px-4 py-3",
                isSelected && !votingClosed
                  ? "border-black bg-gray-100"
                  : "border-gray-200",
                votingClosed && isWinning
                  ? "bg-green-100 border-green-500"
                  : "",
                votingClosed && !isWinning && votes > 0
                  ? "bg-red-100 border-red-400"
                  : "",
              ].join(" ")}
            >
              <View className="flex-row justify-between items-center">
                <Text className="font-medium">{opt.name}</Text>
                {votingClosed && (
                  <Text className="text-gray-600 text-sm">
                    {percentage}% ({votes} vote{votes !== 1 ? "s" : ""})
                  </Text>
                )}
              </View>

              <View className="mt-1">
                {!!opt.datetime && (
                  <Text className="text-gray-600 text-sm">
                    <Text className="font-semibold">Date: </Text>
                    {new Date(opt.datetime).toLocaleString()}
                  </Text>
                )}
                {!!opt.price && (
                  <Text className="text-gray-600 text-sm">
                    <Text className="font-semibold">Price: </Text>${opt.price}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Actions vote */}
      {!votingClosed && (
        <View className="flex-row gap-3 mt-4 flex-wrap">
          <TouchableOpacity
            onPress={handleVote}
            disabled={selectedOption === null}
            className={`px-4 py-3 rounded-full ${selectedOption ? "bg-black" : "bg-gray-300"}`}
          >
            <Text className="text-white font-medium">Submit vote</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption("unavailable")}
            disabled={hasVoted}
            className={`px-4 py-3 rounded-full ${
              hasVoted ? "bg-gray-300" : "bg-gray-900"
            }`}
          >
            <Text className="text-white font-medium">I&apos;m unavailable</Text>
          </TouchableOpacity>

          {hasVoted && (
            <TouchableOpacity
              onPress={handleCancelVote}
              className="px-4 py-3 rounded-full border border-gray-300"
            >
              <Text className="font-medium">Cancel vote</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Liste invités */}
      <View className="mt-8">
        <Text className="text-lg font-semibold mb-3">Who&apos;s voted?</Text>
        {event.guests.map((g) => {
          const status =
            g.vote?.name === "Not available"
              ? { text: "Unavailable", cls: "bg-yellow-100 text-yellow-700" }
              : g.vote
                ? { text: "Voted", cls: "bg-green-100 text-green-700" }
                : { text: "Pending", cls: "bg-gray-200 text-gray-600" };

          return (
            <View
              key={g.nickname}
              className="flex-row justify-between items-center py-2"
            >
              <Text className="text-sm">{g.nickname}</Text>
              <Text className={`text-xs px-2 py-1 rounded-full ${status.cls}`}>
                {status.text}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Chat */}
      <View className="mt-8">
        <Text className="text-lg font-semibold mb-2">Chat</Text>
        {isAllowedToChat ? (
          <ChatBox eventId={eventId} nickname={guest} userId={userId} />
        ) : (
          <View className="border border-gray-200 rounded-xl p-4 items-center">
            <Lock size={20} color="#6b7280" />
            <Text className="text-gray-500 text-center mt-2">
              Chat is only available for Pro users and invited guests linked to
              Pro users.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
