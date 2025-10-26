import React from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import HeaderApp from "@/components/HeaderApp";
import HamburgerMenu from "@/components/HamburgerMenu";

export default function ProtectedLayout() {
  const pathname = usePathname();

  const shouldHideMenu =
    pathname.includes("/setting/") && pathname !== "/(protected)/setting";

  return (
    <View className="flex-1 bg-white">
      <HeaderApp />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
      {!shouldHideMenu && <HamburgerMenu />}
    </View>
  );
}
