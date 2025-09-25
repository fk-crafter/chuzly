import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"; // pour Google, Apple
import { AntDesign } from "@expo/vector-icons"; // pour Github

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key: "email" | "password", value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      console.log("✅ Login success:", data);

      // TODO: stocker token avec AsyncStorage ou SecureStore
      router.replace("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-6 left-6"
      >
        <Text className="text-gray-500 text-sm">← Back</Text>
      </TouchableOpacity>

      {/* Logo + Title */}
      <View className="items-center mb-10">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-12 h-12 rounded-full"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold mt-4">Welcome to Chuzly</Text>
        <Text className="text-gray-500 text-center">
          Login to continue to your account
        </Text>
      </View>

      {/* Social Logins */}
      <View className="space-y-3">
        {/* Google */}
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3">
          <FontAwesome name="google" size={20} color="#DB4437" />
          <Text className="ml-2 text-base font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* GitHub */}
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3">
          <AntDesign name="github" size={20} color="#000" />
          <Text className="ml-2 text-base font-medium">
            Continue with GitHub
          </Text>
        </TouchableOpacity>

        {/* Apple */}
        <View className="relative">
          <TouchableOpacity
            disabled
            className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3 opacity-50"
          >
            <FontAwesome name="apple" size={22} color="#000" />
            <Text className="ml-2 text-base font-medium">
              Continue with Apple
            </Text>
          </TouchableOpacity>
          <View className="absolute top-2 right-4 bg-yellow-400 px-2 py-0.5 rounded -rotate-12">
            <Text className="text-[10px] font-bold text-black">
              COMING SOON
            </Text>
          </View>
        </View>
      </View>

      {/* Separator */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Form */}
      <View className="space-y-4">
        <View>
          <Text className="text-base font-medium mb-1">Email</Text>
          <TextInput
            placeholder="you@example.com"
            value={formData.email}
            onChangeText={(val) => handleChange("email", val)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Password</Text>
          <View className="relative">
            <TextInput
              placeholder="Your password"
              value={formData.password}
              onChangeText={(val) => handleChange("password", val)}
              secureTextEntry={!showPassword}
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3"
            >
              <Text className="text-sm text-blue-600">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-sm text-blue-600">Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="mt-6 w-full py-4 rounded-full bg-blue-600"
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity onPress={() => router.push("/")} className="mt-6">
        <Text className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Text className="text-blue-600 font-semibold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
