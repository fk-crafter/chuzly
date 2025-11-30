import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";
import { Pencil } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

const COLORS = [
  "bg-gray-300",
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-pink-300",
  "bg-purple-300",
];

type Profile = {
  name: string;
  email?: string;
  avatarColor?: string;
  plan?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = useAuthStore.getState().token;
      if (!token) {
        router.push("/(auth)/login");
        throw new Error("No token");
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json() as Promise<Profile>;
    },
  });

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not load your profile",
      });
    }
  }, [error]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setColor(profile.avatarColor || COLORS[0]);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().token;
      if (!token) {
        router.push("/(auth)/login");
        throw new Error("No token");
      }

      if (!name.trim()) {
        throw new Error("Missing name");
      }

      await fetch(`${API_URL}/auth/update-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      await fetch(`${API_URL}/auth/avatar-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color }),
      });

      await AsyncStorage.setItem("avatarColor", color);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Your profile has been updated!",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/(protected)/setting");
    },
    onError: (error: any) => {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to update profile",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate();
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex flex-row items-center justify-center gap-2 mb-8">
        <Pencil size={28} color="black" strokeWidth={2.2} />
        <Text className="text-3xl font-bold text-center">Edit Profile</Text>
      </View>

      <View className="items-center mb-8">
        <View
          className={`w-24 h-24 rounded-full items-center justify-center ${color}`}
        >
          <Text className="text-2xl font-bold text-gray-800">{initials}</Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2 text-sm">Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      <Text className="text-gray-700 mb-3 text-sm">Choose avatar color</Text>
      <View className="flex-row flex-wrap gap-3 mb-8 justify-center">
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            className={`w-10 h-10 rounded-full border-2 ${
              color === c ? "border-black" : "border-transparent"
            } ${c}`}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={updateProfileMutation.isPending}
        className={`py-4 rounded-full ${
          updateProfileMutation.isPending ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white text-center font-semibold text-base">
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(protected)/setting")}
        className="mt-4 border border-gray-300 py-4 rounded-full"
      >
        <Text className="text-black text-center font-semibold text-base">
          Cancel
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
