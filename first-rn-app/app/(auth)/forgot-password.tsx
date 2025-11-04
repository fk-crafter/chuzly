import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendResetLink = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send reset link");

      setSent(true);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white justify-center px-6"
    >
      <View className="items-center mb-10">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-20 h-20 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold text-gray-900">
          Forgot Password
        </Text>
        <Text className="text-gray-500 mt-2 text-center max-w-sm">
          Enter your email to receive a password reset link.
        </Text>
      </View>

      {sent ? (
        <View className="items-center space-y-4">
          <Text className="text-gray-700 text-center">
            ✅ A password reset link has been sent to{" "}
            <Text className="font-semibold">{email}</Text>.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-black rounded-full py-4 w-full mt-4"
          >
            <Text className="text-white text-center font-semibold">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 mb-4"
          />

          <TouchableOpacity
            disabled={loading}
            onPress={handleSendResetLink}
            className="bg-black rounded-full py-4"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-6"
          >
            <Text className="text-center text-gray-500">
              Remember your password?{" "}
              <Text className="text-blue-600 font-semibold">Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
