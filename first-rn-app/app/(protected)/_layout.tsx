import { Stack } from "expo-router";
import { View } from "react-native";
import HeaderApp from "@/components/HeaderApp";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ProtectedLayout() {
  return (
    <View className="flex-1 bg-white">
      <HeaderApp />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <HamburgerMenu />
    </View>
  );
}
