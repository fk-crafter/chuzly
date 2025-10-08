import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { MotiView, AnimatePresence } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Sparkles,
  Info,
  User,
  Palette,
  BadgeCheck,
  PartyPopper,
} from "lucide-react-native";
import { API_URL } from "../../config";

const COLORS = [
  "#f3f4f6",
  "#c7f9cc",
  "#cfe9ff",
  "#fff3c4",
  "#ffd6e0",
  "#e6e0ff",
];

const windowW = Dimensions.get("window").width;

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [token, setToken] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);

  const IMAGES = [
    require("../../assets/images/tst.png"),
    require("../../assets/images/tst.png"),
    require("../../assets/images/tst.png"),
  ];

  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => setToken(t));
    AsyncStorage.getItem("newUserName").then((n) => n && setName(n));
  }, []);

  const next = (to: number | null = null) =>
    setStep((s) => (typeof to === "number" ? to : Math.min(s + 1, 5)));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleNameSubmit = async () => {
    if (!name.trim())
      return Alert.alert("Nom requis", "Merci d'entrer ton nom.");
    if (!token) return Alert.alert("Erreur", "Utilisateur non connecté.");

    try {
      await fetch(`${API_URL}/auth/update-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      await fetch(`${API_URL}/auth/avatar-color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color }),
      });

      await AsyncStorage.setItem("avatarColor", color);
      await AsyncStorage.setItem("userName", name.trim());
      next(5);
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
    }
  };

  const finishOnboarding = async () => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/auth/complete-onboarding`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.warn("complete-onboarding failed", err);
    }
  };

  const MotionCard = ({ children }: { children: React.ReactNode }) => (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10 }}
      transition={{ type: "timing", duration: 280 }}
      className="w-full items-center"
    >
      {children}
    </MotiView>
  );

  const ProgressDots = () => (
    <View className="flex-row justify-center mb-6">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className={`${
            i === step ? "h-2 w-7 bg-black" : "h-1.5 w-3 bg-gray-300"
          } mx-1 rounded-full`}
        />
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-white px-5 pt-10 justify-center">
      <ProgressDots />

      <AnimatePresence exitBeforeEnter>
        {step === 0 && (
          <MotionCard key="0">
            <Sparkles size={36} color="#000" />
            <Text className="text-2xl font-bold mt-3">Welcome to Chuzly</Text>
            <Text className="text-gray-500 text-center mt-3 max-w-xs">
              Plan events faster. Suggest options, vote and share with friends.
            </Text>

            <TouchableOpacity
              onPress={() => next(1)}
              className="bg-black rounded-xl py-3 px-6 mt-6"
            >
              <Text className="text-white font-semibold">Get started</Text>
            </TouchableOpacity>
          </MotionCard>
        )}

        {step === 1 && (
          <MotionCard key="1">
            <Info size={32} color="#000" />
            <Text className="text-xl font-bold mt-3">How it works</Text>
            <Text className="text-gray-500 text-center mt-2 max-w-xs">
              Quick walkthrough — swipe images or tap next to see steps.
            </Text>

            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className="mt-4 w-full"
              onMomentumScrollEnd={(e) => {
                const i = Math.round(
                  e.nativeEvent.contentOffset.x / (windowW - 40)
                );
                setImageIndex(i);
              }}
            >
              {IMAGES.map((src, idx) => (
                <Image
                  key={idx}
                  source={src}
                  className="w-[90vw] h-44 rounded-xl mr-2"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            <View className="flex-row justify-between w-full mt-4">
              <TouchableOpacity
                onPress={() => {
                  setImageIndex((p) => Math.max(p - 1, 0));
                  scrollRef.current?.scrollTo({
                    x: Math.max(0, (imageIndex - 1) * (windowW - 40)),
                    animated: true,
                  });
                }}
                disabled={imageIndex === 0}
                className={`border border-gray-300 rounded-lg py-2 px-4 ${
                  imageIndex === 0 ? "opacity-50" : ""
                }`}
              >
                <Text>← Back</Text>
              </TouchableOpacity>

              {imageIndex < IMAGES.length - 1 ? (
                <TouchableOpacity
                  onPress={() => {
                    setImageIndex((p) => Math.min(p + 1, IMAGES.length - 1));
                    scrollRef.current?.scrollTo({
                      x: Math.min(
                        (imageIndex + 1) * (windowW - 40),
                        (IMAGES.length - 1) * (windowW - 40)
                      ),
                      animated: true,
                    });
                  }}
                  className="bg-black rounded-lg py-2 px-4"
                >
                  <Text className="text-white">Next →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => next(2)}
                  className="bg-black rounded-lg py-2 px-4"
                >
                  <Text className="text-white">Continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </MotionCard>
        )}

        {step === 2 && (
          <MotionCard key="2">
            <User size={32} color="#000" />
            <Text className="text-xl font-bold mt-3">Your name</Text>
            <Text className="text-gray-500 text-center mt-2 max-w-xs">
              How you ll appear to others in events.
            </Text>
            <TextInput
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-lg w-full px-4 py-3 mt-4"
            />

            <View className="flex-row justify-between w-full mt-5">
              <TouchableOpacity onPress={prev}>
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => next(3)}
                disabled={!name.trim()}
                className={`rounded-lg py-2 px-5 ${
                  name.trim()
                    ? "bg-black"
                    : "bg-gray-200 border border-gray-300"
                }`}
              >
                <Text
                  className={`${
                    name.trim() ? "text-white" : "text-gray-400"
                  } font-semibold`}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 3 && (
          <MotionCard key="3">
            <Palette size={32} color="#000" />
            <Text className="text-xl font-bold mt-3">Pick a color</Text>
            <Text className="text-gray-500 text-center mt-2 max-w-xs">
              Choose your avatar color for voting and messages.
            </Text>

            <View className="flex-row flex-wrap justify-center mt-4">
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  className="m-2"
                >
                  <View
                    className={`w-12 h-12 rounded-full border-2`}
                    style={{
                      backgroundColor: c,
                      borderColor: color === c ? "#000" : "#e5e7eb",
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between w-full mt-6">
              <TouchableOpacity onPress={prev}>
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => next(4)}
                className="bg-black rounded-lg py-2 px-5"
              >
                <Text className="text-white">Preview</Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 4 && (
          <MotionCard key="4">
            <BadgeCheck size={32} color="#000" />
            <Text className="text-xl font-bold mt-3">Here’s your profile</Text>
            <View className="items-center mt-5 space-y-2">
              <View
                className="w-16 h-16 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <Text className="font-semibold">{name || "—"}</Text>
            </View>

            <View className="flex-row justify-between w-full mt-6">
              <TouchableOpacity onPress={prev}>
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNameSubmit}
                className="bg-black rounded-lg py-2 px-5"
              >
                <Text className="text-white">Confirm</Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 5 && (
          <MotionCard key="5">
            <PartyPopper size={32} color="#000" />
            <Text className="text-xl font-bold mt-3">You’re ready!</Text>
            <Text className="text-gray-500 text-center mt-2 max-w-xs">
              Time to create your first event or explore the dashboard.
            </Text>

            <View className="w-full mt-5 space-y-3">
              <TouchableOpacity
                onPress={async () => {
                  await finishOnboarding();
                  router.push("/event");
                }}
                className="bg-black rounded-xl py-3"
              >
                <Text className="text-white text-center font-semibold">
                  Create Event
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await finishOnboarding();
                  router.push("/");
                }}
                className="border border-gray-300 rounded-xl py-3"
              >
                <Text className="text-center font-medium">Go to Dashboard</Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}
      </AnimatePresence>
    </View>
  );
}
