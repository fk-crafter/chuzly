import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Menu,
  X,
  Calendar,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react-native";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: "Create Event",
      route: "/(protected)/create-event",
      icon: Calendar,
    },
    { label: "Events", route: "/(protected)/event-list", icon: Calendar },
    {
      label: "Overview",
      route: "/(protected)/overview",
      icon: LayoutDashboard,
    },
    { label: "Settings", route: "/(protected)/setting", icon: Settings },
  ];

  return (
    <>
      {/* Bouton flottant */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="absolute bottom-6 left-6 bg-black p-4 rounded-full shadow-lg z-50"
      >
        <Menu size={24} color="white" />
      </TouchableOpacity>

      {/* Menu latéral */}
      <Modal visible={isOpen} animationType="slide" transparent>
        <Pressable
          onPress={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/40"
        />
        <View className="absolute top-0 left-0 h-full w-[260px] bg-white p-6 shadow-2xl z-50">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-xl font-bold">Chuzly.</Text>
              <Text className="text-xs text-gray-500">Plan. Vote. Share.</Text>
            </View>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <X size={22} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-xs text-gray-400 mb-3">NAVIGATION</Text>

            {navItems.map(({ label, route, icon: Icon }) => {
              const active = pathname === route;
              return (
                <TouchableOpacity
                  key={route}
                  onPress={() => {
                    setIsOpen(false);
                    router.push(route as any);
                  }}
                  className={`flex-row items-center gap-3 p-3 rounded-lg mb-2 ${
                    active ? "bg-black" : "bg-gray-100"
                  }`}
                >
                  <Icon size={18} color={active ? "white" : "black"} />
                  <Text
                    className={`text-sm font-medium ${
                      active ? "text-white" : "text-black"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View className="mt-6 border-t border-gray-200 pt-4">
              <TouchableOpacity
                onPress={() => {
                  setIsOpen(false);
                  router.push("/(protected)/setting/profile");
                }}
                className="flex-row items-center gap-3"
              >
                <User size={18} color="gray" />
                <Text className="text-gray-600">Profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
