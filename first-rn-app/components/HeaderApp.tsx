import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function HeaderApp() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("userName").then((value) => setUserName(value || ""));
  }, []);

  return (
    <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200 bg-white mt-16">
      <Text className="text-lg font-semibold">Chuzly</Text>
      <TouchableOpacity onPress={() => router.push("/(protected)/setting")}>
        <Text className="text-gray-500">{userName || "..."}</Text>
      </TouchableOpacity>
    </View>
  );
}
