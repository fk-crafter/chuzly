import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MessageCircle, ThumbsUp, Trash2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TapGestureHandler, Swipeable } from "react-native-gesture-handler";
import { API_URL } from "@/config";

export default function FeedbackListScreen() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scaleAnimRef = useRef<{ [key: string]: Animated.Value }>({});

  const initAnimations = (items: any[]) => {
    const anims: any = {};
    items.forEach((fb) => {
      anims[fb.id] = new Animated.Value(1);
    });
    scaleAnimRef.current = anims;
  };

  const animate = (id: string) => {
    const anim = scaleAnimRef.current[id];
    if (!anim) return;

    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadFeedbacks = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch feedbacks");

      const data = await res.json();

      const formatted = data.map((f: any) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        votes: f.votes,
        liked: f.likedBy.includes(f.currentUserId),
        user: { name: f.user.name },
        date: "just now",
      }));

      setFeedbacks(formatted);
      initAnimations(formatted);
    } catch (e) {
      console.log("failed to load feedbacks", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  useFocusEffect(
    useCallback(() => {
      loadFeedbacks();
    }, [loadFeedbacks])
  );

  const toggleLike = async (id: string) => {
    animate(id);

    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/feedback/${id}/like`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to like");

      const updated = await res.json();

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === id
            ? {
                ...fb,
                votes: updated.votes,
                liked: updated.likedBy.includes(updated.userId),
              }
            : fb
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFeedback = async (id: string) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      console.log("Failed to delete feedback", e);
    }
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

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

      {feedbacks.map((fb) => {
        const renderRightActions = () => {
          if (fb.user?.name !== "You") return null;

          return (
            <TouchableOpacity
              onPress={() => deleteFeedback(fb.id)}
              className="bg-red-500 justify-center items-center w-20 h-28"
            >
              <Trash2 size={26} color="white" />
            </TouchableOpacity>
          );
        };

        return (
          <Swipeable
            key={fb.id}
            renderRightActions={renderRightActions}
            overshootRight={false}
          >
            <TapGestureHandler
              numberOfTaps={2}
              onActivated={() => toggleLike(fb.id)}
            >
              <View className="mb-6 pb-4 border-b border-gray-200 bg-white">
                <Text className="text-xl font-semibold text-gray-900">
                  {fb.title}
                </Text>

                <Text className="text-gray-600 mt-1">{fb.description}</Text>

                <View className="flex-row items-center mt-3">
                  <View className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-3">
                    <Text className="font-bold text-gray-700">
                      {getInitials(fb.user?.name || "")}
                    </Text>
                  </View>

                  <Text className="text-gray-500 text-sm">
                    {fb.user?.name} • {fb.date}
                  </Text>

                  <TouchableOpacity
                    onPress={() => toggleLike(fb.id)}
                    className="flex-row items-center ml-auto bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <Animated.View
                      style={{
                        transform: [
                          { scale: scaleAnimRef.current[fb.id] || 1 },
                        ],
                      }}
                    >
                      <ThumbsUp
                        size={16}
                        color={fb.liked ? "#2563EB" : "#333"}
                      />
                    </Animated.View>

                    <Text className="ml-1 font-semibold text-gray-800">
                      {fb.votes}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TapGestureHandler>
          </Swipeable>
        );
      })}
    </ScrollView>
  );
}
