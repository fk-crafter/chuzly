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
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL } from "@/config";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirm) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }
    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Passwords do not match",
      });
      return;
    }
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid or missing reset token",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) throw new Error("Failed to reset password");

      setDone(true);
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
        <Text className="text-2xl font-bold text-gray-900">Reset Password</Text>
        <Text className="text-gray-500 mt-2 text-center max-w-sm">
          Enter your new password below.
        </Text>
      </View>

      {done ? (
        <View className="items-center space-y-4">
          <Text className="text-gray-700 text-center">
            ✅ Your password has been reset successfully.
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
            placeholder="New password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 mb-3"
          />

          <TextInput
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 mb-4"
          />

          <TouchableOpacity
            disabled={loading}
            onPress={handleResetPassword}
            className="bg-black rounded-full py-4"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Reset Password
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
