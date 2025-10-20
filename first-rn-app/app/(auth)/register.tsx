import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Registration failed");
      }

      const data = await res.json();

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userName", data.name);
      await AsyncStorage.setItem("userPlan", data.plan);

      router.replace("/(protected)/overview");
    } catch (err: any) {
      console.error("Register error:", err);
      Alert.alert("Error", err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-20 h-20 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold text-gray-900">
            Create your account
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Plan, vote, and share events with friends
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-1 font-medium">Name</Text>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1 font-medium">Email</Text>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1 font-medium">Password</Text>
            <TextInput
              placeholder="********"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1 font-medium">
              Confirm Password
            </Text>
            <TextInput
              placeholder="********"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900"
            />
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={handleRegister}
            className="bg-black rounded-full py-4 mt-4"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-6"
          >
            <Text className="text-center text-gray-500">
              Already have an account?{" "}
              <Text className="text-blue-600 font-semibold">Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
