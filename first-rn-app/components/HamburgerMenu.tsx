import { View, TouchableOpacity, Text } from "react-native";
import { Link, usePathname } from "expo-router";

export default function HamburgerMenu() {
  const pathname = usePathname();
  const cleanPath = pathname.replace("/(protected)", "");

  const tabs = [
    { name: "Overview", path: "/overview" },
    { name: "Create", path: "/create-event" },
    { name: "Settings", path: "/setting" },
  ];

  return (
    <View className="absolute bottom-8 left-4 right-4 bg-white rounded-full shadow-md flex-row justify-around items-center p-3 border border-gray-200">
      {tabs.map((tab) => {
        const isActive =
          cleanPath === tab.path || cleanPath.startsWith(tab.path + "/");

        return (
          <Link key={tab.name} href={`/(protected)${tab.path}` as any} asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className={`flex-1 mx-1 py-2 rounded-full items-center justify-center transition-all duration-150 ${
                isActive ? "bg-black" : " bg-transparent"
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}
