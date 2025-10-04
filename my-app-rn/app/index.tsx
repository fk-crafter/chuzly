import "../global.css";
import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // check token
  }, []);

  return (
    <View className="flex-1 bg-black">
      <ImageBackground
        source={require("../assets/images/tst.png")}
        className="absolute w-full h-full"
        imageStyle={{ resizeMode: "cover", opacity: 0.15 }}
      />

      <View className="flex-1 items-center justify-between px-6 py-16 relative">
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="mt-10 border border-white/20 rounded-full p-3"
        >
          <Image
            source={require("../assets/images/logo.png")}
            className="w-16 h-16 rounded-full"
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          className="items-center space-y-4"
        >
          <Text className="text-3xl font-bold text-white text-center leading-snug">
            Plan with your {"\n"} friends, fast.
          </Text>
          <Text className="text-sm text-gray-400 text-center max-w-xs">
            Skip the chaos. One link, clear options, quick decisions.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          className="w-full max-w-sm space-y-4"
        >
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="w-full py-5 rounded-full bg-white"
          >
            <Text className="text-black font-semibold text-base text-center">
              Log in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/createaccount")}
            className="w-full py-5 rounded-full bg-[#111] border border-[#333]"
          >
            <Text className="text-white font-semibold text-base text-center">
              Create an account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/onboarding")}>
            <Text className="text-white font-semibold text-base text-center">
              Go to onboarding
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
