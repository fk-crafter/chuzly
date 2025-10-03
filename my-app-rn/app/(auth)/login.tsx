import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import GoogleIcon from "../../components/GoogleIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

export default function LoginScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Login failed");
      }

      const data = await res.json();

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userName", data.name || "");
      await AsyncStorage.setItem("userPlan", data.plan || "");

      Alert.alert("Success 🎉", "Welcome back " + data.name);
      router.push("/event/create-event");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Login failed", err.message || "Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-6 left-6"
      >
        <Text className="text-gray-500 text-sm">← Back</Text>
      </TouchableOpacity>

      <View className="items-center mb-10">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-12 h-12 rounded-full"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold mt-4">Welcome to Chuzly</Text>
        <Text className="text-gray-500 text-center">
          Login to continue to your account
        </Text>
      </View>

      <View className="space-y-3">
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3">
          <GoogleIcon />
          <Text className="ml-2 text-base font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-full py-3">
          <AntDesign name="github" size={20} color="#000" />
          <Text className="ml-2 text-base font-medium">
            Continue with GitHub
          </Text>
        </TouchableOpacity>

        <View className="relative">
          <TouchableOpacity
            disabled
            className="w-full flex-row items-center justify-center border border-gray-300 rounded-full py-3 opacity-50"
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

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

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
              secureTextEntry
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
            />
          </View>
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-sm text-black">Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className={`mt-6 w-full py-4 rounded-full ${
          loading ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/createaccount")}
        className="mt-6"
      >
        <Text className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Text className="text-black font-semibold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
