import { View, TouchableOpacity } from "react-native";
import { Link, usePathname } from "expo-router";
import { Home, Plus, Settings } from "lucide-react-native";

export default function HamburgerMenu() {
  const pathname = usePathname();
  const cleanPath = pathname.replace("/(protected)", "");

  const tabs = [
    { name: "Overview", path: "/overview", icon: Home },
    { name: "Create", path: "/create-event", icon: Plus },
    { name: "Settings", path: "/setting", icon: Settings },
  ];

  return (
    <View className="absolute bottom-6 left-4 right-4 items-center">
      <View className="w-full bg-white rounded-full shadow-md border border-gray-200 flex-row justify-between items-center px-10 py-4 relative">
        {tabs.map((tab, i) => {
          if (tab.name === "Create") return null;
          const isActive =
            cleanPath === tab.path || cleanPath.startsWith(tab.path + "/");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={`/(protected)${tab.path}` as any}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.8}
                className={`p-3 rounded-full ${
                  isActive ? "bg-black" : "bg-transparent"
                }`}
              >
                <Icon
                  size={26}
                  color={isActive ? "white" : "gray"}
                  strokeWidth={2.4}
                />
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>

      <View className="absolute -top-5 bg-white w-20 h-20 rounded-full shadow-md border border-gray-200 items-center justify-center">
        <Link href="/(protected)/create-event" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-black w-14 h-14 rounded-full items-center justify-center shadow-lg"
          >
            <Plus size={30} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
