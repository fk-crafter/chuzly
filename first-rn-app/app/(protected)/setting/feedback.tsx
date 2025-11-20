import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FeedbackScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendFeedback = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      setSent(true);
      setMessage("");

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-900 mb-4">
        Send Feedback
      </Text>
      <Text className="text-gray-600 mb-4">
        Tell us what you think about the app! 😊
      </Text>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your feedback here..."
        multiline
        className="bg-gray-100 p-4 rounded-xl h-40 text-gray-800"
      />

      <TouchableOpacity
        onPress={sendFeedback}
        disabled={sending}
        className={`mt-6 py-4 rounded-xl ${
          sending ? "bg-gray-300" : "bg-black"
        }`}
      >
        {sending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Send
          </Text>
        )}
      </TouchableOpacity>

      {sent && (
        <Text className="mt-4 text-green-600 font-semibold text-center">
          Thank you for your feedback! 🥰
        </Text>
      )}
    </View>
  );
}
