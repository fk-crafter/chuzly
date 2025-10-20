import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";

export default function HamburgerMenu() {
  const router = useRouter();

  return (
    <View className="absolute bottom-8 left-4 right-4 bg-white rounded-full shadow-md flex-row justify-around p-4">
      <TouchableOpacity onPress={() => router.push("/(protected)/overview")}>
        <Text>Overview</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/(protected)/create-event")}
      >
        <Text>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(protected)/setting")}>
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
