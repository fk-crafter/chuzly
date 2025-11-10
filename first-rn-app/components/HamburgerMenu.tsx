import { View, TouchableOpacity } from "react-native";
import { Link, usePathname } from "expo-router";
import { Home, PlusCircle, Settings } from "lucide-react-native";

export default function HamburgerMenu() {
  const pathname = usePathname();
  const cleanPath = pathname.replace("/(protected)", "");

  const tabs = [
    { name: "Overview", path: "/overview", icon: Home },
    { name: "Create", path: "/create-event", icon: PlusCircle },
    { name: "Settings", path: "/setting", icon: Settings },
  ];

  return (
    <View className="absolute bottom-8 left-4 right-4 bg-white rounded-full shadow-md flex-row justify-around items-center p-3 border border-gray-200">
      {tabs.map((tab) => {
        const isActive =
          cleanPath === tab.path || cleanPath.startsWith(tab.path + "/");

        const Icon = tab.icon;

        return (
          <Link key={tab.name} href={`/(protected)${tab.path}` as any} asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className={`flex-1 mx-1 py-2 rounded-full items-center justify-center transition-all duration-150 ${
                isActive ? "bg-black" : "bg-transparent"
              }`}
            >
              <Icon
                size={24}
                color={isActive ? "white" : "gray"}
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
}
