import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL } from "@/config";

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string | undefined;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "invalid" | null>(
    null
  );

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("invalid");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/verify?token=${token}`);
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verify email error:", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Image
        source={require("../../assets/images/logo.png")}
        className="w-20 h-20 mb-6 rounded-full"
      />

      {loading ? (
        <View className="items-center">
          <ActivityIndicator size="large" color="black" />
          <Text className="mt-4 text-gray-600">Verifying your email...</Text>
        </View>
      ) : status === "success" ? (
        <View className="items-center">
          <Text className="text-2xl font-bold text-green-600 mb-2">
            Email Verified 🎉
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Your account has been successfully verified.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="bg-black rounded-full py-4 px-8"
          >
            <Text className="text-white font-semibold text-base">
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      ) : status === "error" ? (
        <View className="items-center">
          <Text className="text-2xl font-bold text-red-600 mb-2">
            Verification Failed ❌
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Something went wrong while verifying your email.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            className="bg-black rounded-full py-4 px-8"
          >
            <Text className="text-white font-semibold text-base">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center">
          <Text className="text-2xl font-bold text-red-600 mb-2">
            Invalid Link ⚠️
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            This verification link is not valid or expired.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            className="bg-black rounded-full py-4 px-8"
          >
            <Text className="text-white font-semibold text-base">
              Register Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
