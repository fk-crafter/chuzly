import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateFeedbackScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!title.trim() || !message.trim()) return;

    setSending(true);

    try {
      const stored = await AsyncStorage.getItem("local_feedbacks");
      const existing = stored ? JSON.parse(stored) : [];

      const newFeedback = {
        id: Date.now().toString(),
        title,
        description: message,
        user: {
          name: "You",
        },
        date: "just now",
        votes: 0,
      };

      const updated = [newFeedback, ...existing];

      await AsyncStorage.setItem("local_feedbacks", JSON.stringify(updated));

      router.back();
    } catch (err) {
      console.error("Error saving feedback", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        Give Feedback
      </Text>

      <Text className="text-gray-700 mb-2 font-semibold">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Short title"
        className="bg-gray-100 p-4 rounded-xl mb-4"
      />

      <Text className="text-gray-700 mb-2 font-semibold">Description</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Describe your idea..."
        multiline
        className="bg-gray-100 p-4 rounded-xl h-40"
      />

      <TouchableOpacity
        onPress={submit}
        disabled={sending}
        className={`mt-6 py-4 rounded-xl ${
          sending ? "bg-gray-300" : "bg-black"
        }`}
      >
        {sending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Submit
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
