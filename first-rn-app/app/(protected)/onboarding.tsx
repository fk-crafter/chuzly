import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { API_URL } from "@/config";

const COLORS = [
  "bg-gray-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-pink-300",
  "bg-purple-300",
];

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const videoSteps = useMemo(
    () => [
      {
        title: "Fill in the Event Details",
        description:
          "Add everything you need: name, guests, price, location, and date options.",
        source: require("@/assets/vid/step1.mp4"),
      },
      {
        title: "Share Your Event",
        description:
          "Copy the invite link and send it to your friends. They’ll see the full event overview.",
        source: require("@/assets/vid/step2.mp4"),
      },
      {
        title: "Friends Vote",
        description:
          "Each guest picks their favorite option. Simple and fast voting experience.",
        source: require("@/assets/vid/step3.mp4"),
      },
    ],
    []
  );

  const player = useVideoPlayer(videoSteps[0].source, (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    let isMounted = true;

    const updateVideo = async () => {
      if (step === 1) {
        try {
          await player.replaceAsync(videoSteps[videoIndex].source);
          if (isMounted) player.play();
        } catch (error) {
          console.warn("Failed to load video:", error);
        }
      } else {
        player.pause();
      }
    };

    updateVideo();

    return () => {
      isMounted = false;
    };
  }, [step, videoIndex, player, videoSteps]);

  const handleNext = () => {
    if (step < 5) setStep((prev) => prev + 1);
  };

  const handleFinish = async (redirect: "create" | "overview") => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) return router.push("/(auth)/login");

    try {
      await fetch(`${API_URL}/auth/update-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      await fetch(`${API_URL}/auth/avatar-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color }),
      });

      await fetch(`${API_URL}/auth/complete-onboarding`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.setItem("avatarColor", color);

      router.replace(
        redirect === "create"
          ? "/(protected)/create-event"
          : "/(protected)/overview"
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <View className="flex-row justify-center mb-8 gap-1">
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            className={`h-2 w-8 rounded-full ${
              step === i ? "bg-black" : "bg-gray-200"
            }`}
          />
        ))}
      </View>

      {step === 0 && (
        <View>
          <Text className="text-3xl font-bold mb-4 text-center">
            Welcome to Chuzly 🎉
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Plan events faster. Suggest options, vote, and share with friends.
          </Text>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-black py-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <View>
          <Text className="text-2xl font-bold mb-4 text-center">
            How it works 📽️
          </Text>
          <VideoView
            player={player}
            style={{
              width: width - 48,
              height: (width - 48) * 0.56,
              borderRadius: 12,
            }}
            contentFit="cover"
          />
          <Text className="text-lg font-semibold mt-4 text-center">
            {videoSteps[videoIndex].title}
          </Text>
          <Text className="text-gray-500 text-center mb-4">
            {videoSteps[videoIndex].description}
          </Text>
          <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <View
              className="h-full bg-black rounded-full"
              style={{
                width: `${((videoIndex + 1) / videoSteps.length) * 100}%`,
              }}
            />
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setVideoIndex(Math.max(videoIndex - 1, 0))}
              className="border border-gray-300 py-3 px-6 rounded-full"
              disabled={videoIndex === 0}
            >
              <Text className="font-semibold">← Back</Text>
            </TouchableOpacity>
            {videoIndex < videoSteps.length - 1 ? (
              <TouchableOpacity
                onPress={() =>
                  setVideoIndex(Math.min(videoIndex + 1, videoSteps.length - 1))
                }
                className="bg-black py-3 px-6 rounded-full"
              >
                <Text className="text-white font-semibold">Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                className="bg-black py-3 px-6 rounded-full"
              >
                <Text className="text-white font-semibold">Continue</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text className="text-2xl font-bold mb-6 text-center">
            Your name ✏️
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
          />
          <TouchableOpacity
            onPress={() => {
              if (!name.trim()) Alert.alert("Error", "Please enter your name");
              else handleNext();
            }}
            className="bg-black py-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text className="text-2xl font-bold mb-6 text-center">
            Pick a color 🎨
          </Text>
          <View className="flex-row flex-wrap justify-center gap-3 mb-6">
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                className={`w-12 h-12 rounded-full border-2 ${
                  color === c ? "border-black" : "border-transparent"
                } ${c}`}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-black py-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold">
              Preview
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View>
          <Text className="text-2xl font-bold mb-3 text-center">
            Here’s your profile ✅
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            You can change this later from settings.
          </Text>
          <View className="items-center mb-8">
            <View className={`w-20 h-20 rounded-full ${color}`} />
            <Text className="mt-3 text-lg font-semibold">{name}</Text>
          </View>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-black py-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold">
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 5 && (
        <View>
          <Text className="text-2xl font-bold mb-4 text-center">
            You&apos;re ready! 🎊
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Time to create your first event or explore the dashboard.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => handleFinish("create")}
                className="bg-black py-4 rounded-full mb-3"
              >
                <Text className="text-white text-center font-semibold">
                  Create Event
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleFinish("overview")}
                className="border border-gray-300 py-4 rounded-full"
              >
                <Text className="text-center font-semibold">
                  Go to Dashboard
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}
