import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import HeaderApp from "@/components/HeaderApp";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ProtectedLayout() {
  return (
    <View className="flex-1 bg-white">
      <HeaderApp />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
      <HamburgerMenu />
    </View>
  );
}
