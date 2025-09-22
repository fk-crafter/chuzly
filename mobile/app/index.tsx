import { View, Text, TouchableOpacity } from "react-native";
import Link from "expo-router/link";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to Chuzly 🎉
      </Text>
      <Text className="text-gray-600 mb-8">
        Plan, Vote & Share your events easily.
      </Text>

      <Link href="/events" asChild>
        <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-xl">
          <Text className="text-white font-medium text-base">login/signin</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
