import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MessageCircle, ThumbsUp } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FeedbackListScreen() {
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("local_feedbacks");

      if (stored) {
        setFeedbacks(JSON.parse(stored));
      } else {
        const defaultFeedbacks = [
          {
            id: "1",
            title: "Current day Swipe gestures",
            description: "Add ability to swipe between next and previous day.",
            user: { name: "nbashar" },
            date: "last week",
            votes: 8,
          },
          {
            id: "2",
            title: "Streaks and weekly",
            description: "See weekly streak progress.",
            user: { name: "test" },
            date: "last week",
            votes: 7,
          },
        ];

        setFeedbacks(defaultFeedbacks);
        await AsyncStorage.setItem(
          "local_feedbacks",
          JSON.stringify(defaultFeedbacks)
        );
      }
    } catch (err) {
      console.error("Failed to load feedbacks", err);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFeedbacks();
    }, [])
  );

  const handleUpvote = async (id: string) => {
    try {
      const updated = feedbacks.map((fb) =>
        fb.id === id ? { ...fb, votes: fb.votes + 1 } : fb
      );

      setFeedbacks(updated);

      await AsyncStorage.setItem("local_feedbacks", JSON.stringify(updated));
    } catch (err) {
      console.error("Error upvoting", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        All Feedback
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(protected)/setting/feedback/create")}
        className="flex-row items-center justify-between bg-gray-100 px-4 py-4 rounded-xl mb-6"
      >
        <View className="flex-row items-center">
          <MessageCircle size={22} color="#333" />
          <Text className="ml-3 text-lg font-semibold text-gray-900">
            Give Feedback
          </Text>
        </View>
        <Text className="text-gray-500 text-xl">{">"}</Text>
      </TouchableOpacity>

      {feedbacks.map((fb) => (
        <View key={fb.id} className="mb-6 pb-4 border-b border-gray-200">
          <Text className="text-xl font-semibold text-gray-900">
            {fb.title}
          </Text>

          <Text className="text-gray-600 mt-1">{fb.description}</Text>

          <View className="flex-row items-center mt-3">
            <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
              <Text className="font-bold text-gray-700">
                {getInitials(fb.user?.name || "U")}
              </Text>
            </View>

            <Text className="text-gray-500 text-sm">
              {fb.user?.name || "Unknown"} • {fb.date}
            </Text>

            <TouchableOpacity
              onPress={() => handleUpvote(fb.id)}
              className="flex-row items-center ml-auto bg-gray-100 px-3 py-1.5 rounded-full"
            >
              <ThumbsUp size={16} color="#333" />
              <Text className="ml-1 font-semibold text-gray-800">
                {fb.votes}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
