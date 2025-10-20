import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";

const COLORS = [
  "bg-gray-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-pink-300",
  "bg-purple-300",
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2 && !name.trim()) Alert.alert("Enter your name");
    else if (step === 2) setStep(3);
    else if (step === 3) handleFinish();
  };

  const handleFinish = async () => {
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
      router.replace("/(protected)/overview");
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
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {step === 1 && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-3xl font-bold mb-6 text-center">
            Welcome 👋
          </Text>
          <Text className="text-gray-500 text-center mb-10">
            Let&apos;s set up your profile to get started!
          </Text>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-black px-8 py-4 rounded-full"
          >
            <Text className="text-white font-semibold">Start</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text className="text-2xl font-bold mb-6 text-center">
            What&apos;s your name?
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
          />
          <TouchableOpacity
            onPress={handleNext}
            className="bg-black py-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View>
          <Text className="text-2xl font-bold mb-6 text-center">
            Choose your color
          </Text>
          <View className="flex-row flex-wrap gap-3 justify-center mb-8">
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 ${color === c ? "border-black" : "border-transparent"} ${c}`}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleFinish}
            className="bg-black py-4 rounded-full"
            disabled={loading}
          >
            <Text className="text-white text-center font-semibold">
              {loading ? "Saving..." : "Finish"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
