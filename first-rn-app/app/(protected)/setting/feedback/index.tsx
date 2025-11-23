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
import { MessageCircle, ThumbsUp } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TapGestureHandler, Swipeable } from "react-native-gesture-handler";

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
      const stored = await AsyncStorage.getItem("local_feedbacks");

      if (stored) {
        const parsed = JSON.parse(stored);
        setFeedbacks(parsed);
        initAnimations(parsed);
      } else {
        const defaults = [
          {
            id: "1",
            title: "Current day Swipe gestures",
            description: "Add ability to swipe between next and previous day.",
            user: { name: "nbashar" },
            date: "last week",
            votes: 8,
            liked: false,
          },
          {
            id: "2",
            title: "Streaks and weekly",
            description: "See weekly streak progress.",
            user: { name: "test" },
            date: "last week",
            votes: 7,
            liked: false,
          },
        ];

        setFeedbacks(defaults);
        initAnimations(defaults);
        await AsyncStorage.setItem("local_feedbacks", JSON.stringify(defaults));
      }
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

    const updated = feedbacks.map((fb) => {
      if (fb.id === id) {
        const liked = !fb.liked;
        const votes = liked ? fb.votes + 1 : fb.votes - 1;
        return { ...fb, liked, votes };
      }
      return fb;
    });

    setFeedbacks(updated);
    await AsyncStorage.setItem("local_feedbacks", JSON.stringify(updated));
  };

  const deleteFeedback = async (id: string) => {
    const updated = feedbacks.filter((fb) => fb.id !== id);
    setFeedbacks(updated);
    await AsyncStorage.setItem("local_feedbacks", JSON.stringify(updated));
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
              <Text className="text-white font-semibold">Delete</Text>
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
