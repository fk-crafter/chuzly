import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../config";

const COLORS = [
  "bg-gray-200",
  "bg-[#c7f9cc]",
  "bg-[#cfe9ff]",
  "bg-[#fff3c4]",
  "bg-[#ffd6e0]",
  "bg-[#e6e0ff]",
];

export default function ProfileSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState("");
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    plan: string;
    avatarColor?: string;
  } | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setProfile({
          name: data.name,
          email: data.email ?? "",
          plan: data.plan,
          avatarColor: data.avatarColor || COLORS[0],
        });
        setNameInput(data.name);
        setSelectedColor(data.avatarColor || COLORS[0]);
      } catch (err) {
        Alert.alert("Error", "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveName = async () => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/auth/update-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: nameInput }),
      });
      setProfile((p) => (p ? { ...p, name: nameInput } : p));
      Alert.alert("Success", "Name updated!");
    } catch {
      Alert.alert("Error", "Failed to update name");
    }
  };

  const saveColor = async () => {
    try {
      const token = await getToken();
      await fetch(`${API_URL}/auth/avatar-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ color: selectedColor }),
      });
      Alert.alert("Saved", "Avatar color updated");
    } catch {
      Alert.alert("Error", "Failed to save color");
    }
  };

  const deleteAccount = async () => {
    if (confirm !== "DELETE") return;
    try {
      const token = await getToken();
      await fetch(`${API_URL}/auth/delete`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      Alert.alert("Account deleted");
    } catch {
      Alert.alert("Error", "Account deletion failed");
    }
  };

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading profile…</Text>
      </View>
    );

  const initials = (profile?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold mb-6 text-center">
        Public profile
      </Text>

      <View className="items-center">
        <View
          className={`w-24 h-24 rounded-full items-center justify-center ${selectedColor}`}
        >
          <Text className="text-xl font-semibold">{initials}</Text>
        </View>

        <View className="flex-row flex-wrap gap-2 justify-center mt-4">
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setSelectedColor(c)}
              className={`w-10 h-10 rounded-full border-2 ${c} ${
                selectedColor === c ? "border-black" : "border-transparent"
              }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={saveColor}
          className="mt-3 bg-black rounded-full px-5 py-3"
        >
          <Text className="text-white font-semibold">Save avatar color</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 gap-4">
        <View>
          <Text className="text-sm text-gray-600 mb-1">Full name</Text>
          <View className="flex-row gap-2">
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              className="flex-1 border rounded-xl px-4 py-3"
            />
            <TouchableOpacity
              onPress={saveName}
              className="border rounded-xl px-4 py-3"
            >
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">Email</Text>
          <TextInput
            value={profile!.email}
            editable={false}
            className="border rounded-xl px-4 py-3 text-gray-500"
          />
        </View>

        <View>
          <Text className="text-sm text-gray-600 mb-1">Plan</Text>
          <TextInput
            value={profile!.plan}
            editable={false}
            className="border rounded-xl px-4 py-3 text-gray-500"
          />
        </View>
      </View>

      <View className="mt-10 border rounded-2xl p-4">
        <Text className="font-semibold mb-2">Delete account</Text>
        <Text className="text-sm text-gray-500 mb-3">
          This action cannot be undone. Type{" "}
          <Text className="font-bold">DELETE</Text> to confirm.
        </Text>

        <TextInput
          placeholder="Type DELETE"
          value={confirm}
          onChangeText={(t) => setConfirm(t.toUpperCase())}
          className="border rounded-xl px-4 py-3 mb-3"
        />

        <TouchableOpacity
          disabled={confirm !== "DELETE"}
          onPress={deleteAccount}
          className={`rounded-full px-5 py-3 ${
            confirm === "DELETE" ? "bg-red-600" : "bg-red-300"
          }`}
        >
          <Text className="text-white text-center font-semibold">Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
