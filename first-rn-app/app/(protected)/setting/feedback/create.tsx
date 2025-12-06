import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth-store";
import { MessageCircle } from "lucide-react-native";

export default function CreateFeedbackScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fadeAnim = React.useMemo(() => new Animated.Value(0), []);
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const submit = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    animateButton();

    try {
      const token = useAuthStore.getState().token;
      if (!token) return;

      const res = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send feedback");

      Toast.show({
        type: "success",
        text1: "Thank you!",
        text2: "Your feedback has been sent 👌",
      });

      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 px-6 pb-20"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <View className="flex-row items-center justify-center mb-8 mt-6">
            <MessageCircle size={30} color="black" strokeWidth={2.2} />
            <Text className="text-3xl font-bold text-gray-900 ml-3">
              Give Feedback
            </Text>
          </View>

          <View className="bg-gray-50 rounded-3xl p-6 shadow-md border border-gray-200 mb-6">
            <Text className="text-gray-700 mb-2 font-semibold text-base">
              Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Short and clear"
              className="bg-white px-4 py-3 rounded-xl border border-gray-300 focus:border-black"
            />

            <Text className="text-gray-700 mb-2 mt-6 font-semibold text-base">
              Description
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your idea…"
              multiline
              className="bg-white px-4 py-4 rounded-xl border border-gray-300 h-40 text-base"
            />

            <Text className="text-right text-xs text-gray-500 mt-2">
              {message.length} / 500
            </Text>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={submit}
              disabled={sending}
              className="py-4 rounded-full mb-4"
              style={{
                backgroundColor: sending ? "#ccc" : undefined,
                ...(sending
                  ? {}
                  : {
                      backgroundColor: "black",
                    }),
              }}
            >
              {sending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Submit Feedback
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="py-4 rounded-full border border-gray-300"
          >
            <Text className="text-center text-gray-800 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
