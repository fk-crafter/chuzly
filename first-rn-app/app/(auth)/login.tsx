import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      if (!email || !password) throw new Error("Please fill in all fields");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Login failed");
      }

      return res.json();
    },
    onSuccess: async (data) => {
      useAuthStore.getState().setAuth({
        token: data.token,
        userName: data.name,
        userPlan: data.plan,
      });

      Toast.show({
        type: "success",
        text1: "Welcome back 👋",
      });

      router.replace("/(protected)/overview");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error?.message || "Please try again.",
      });
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  const handleOAuthLogin = async (provider: "google" | "github" | "apple") => {
    try {
      const redirectUri = Linking.createURL("/");
      const authUrl = `${API_URL}/auth/${provider}?redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (result.type === "success" && result.url) {
        const tokenMatch = result.url.match(/token=([^&]+)/);
        if (tokenMatch) {
          const token = decodeURIComponent(tokenMatch[1]);
          useAuthStore.getState().setAuth({ token });
          router.replace("/(protected)/overview");
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No token found in redirect URL",
          });
        }
      }
    } catch (err) {
      console.error("OAuth error:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to sign in with " + provider,
      });
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
          Welcome to Chuzly
        </Text>
        <Text className="text-gray-500 mt-2 text-center">
          Log in to plan and vote with your friends
        </Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-1 font-medium">Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-1 font-medium">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4">
            <TextInput
              placeholder="Your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="flex-1 py-3 text-base text-gray-900"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text className="text-blue-600 font-semibold">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          className="self-end mt-2"
        >
          <Text className="text-blue-500 text-sm font-medium">
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loginMutation.isPending}
          onPress={handleLogin}
          className={`rounded-full py-4 mt-4 ${
            loginMutation.isPending ? "bg-gray-400" : "bg-black"
          }`}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Log in
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-3 text-gray-400 text-sm">or</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <TouchableOpacity
          onPress={() => handleOAuthLogin("google")}
          className="border border-gray-300 rounded-full py-4 flex-row items-center justify-center mb-3"
        >
          <FontAwesome name="google" size={20} color="black" />
          <Text className="ml-2 text-base font-semibold text-gray-800">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleOAuthLogin("github")}
          className="border border-gray-300 rounded-full py-4 flex-row items-center justify-center mb-3"
        >
          <FontAwesome name="github" size={20} color="black" />
          <Text className="ml-2 text-base font-semibold text-gray-800">
            Continue with GitHub
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled
          className="border border-gray-300 rounded-full py-4 flex-row items-center justify-center opacity-50"
        >
          <FontAwesome name="apple" size={20} color="black" />
          <Text className="ml-2 text-base font-semibold text-gray-800">
            Continue with Apple (soon)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="mt-6"
        >
          <Text className="text-center text-gray-500">
            Don’t have an account?{" "}
            <Text className="text-blue-600 font-semibold">Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
