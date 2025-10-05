// app/(onboarding)/OnboardingScreen.tsx
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
import { API_URL } from "../../config"; // adapte si tu utilises un autre fichier config

const COLORS = [
  "#f3f4f6", // muted
  "#c7f9cc", // pastel green
  "#cfe9ff", // pastel blue
  "#fff3c4", // pastel yellow
  "#ffd6e0", // pastel pink
  "#e6e0ff", // pastel lavender
];

const windowW = Dimensions.get("window").width;

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>(COLORS[0]);
  const [token, setToken] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const scrollRef = useRef<ScrollView | null>(null);

  // images locales (remplace /assets/ par ton chemin)
  const IMAGES = [
    require("../../assets/images/tst.png"),
    require("../../assets/images/tst.png"),
    require("../../assets/images/tst.png"),
  ];

  useEffect(() => {
    // récupérer token depuis AsyncStorage (même logique que localStorage côté web)
    AsyncStorage.getItem("token").then((t) => {
      setToken(t);
    });
    // si tu veux préremplir le nom depuis storage
    AsyncStorage.getItem("newUserName").then((n) => {
      if (n) setName(n);
    });
  }, []);

  const next = (to: number | null = null) => {
    setStep((s) => (typeof to === "number" ? to : Math.min(s + 1, 5)));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleNameSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Nom requis", "Merci d'entrer ton nom.");
      return;
    }
    if (!token) {
      Alert.alert("Erreur", "Utilisateur non connecté (token manquant).");
      return;
    }

    try {
      // update name
      await fetch(`${API_URL}/auth/update-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      // update color
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
      console.error("Onboarding error:", err);
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

  // petit helper UI pour les dots
  function ProgressDots() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{
              height: i === step ? 8 : 6,
              width: i === step ? 28 : 14,
              borderRadius: 10,
              backgroundColor: i === step ? "#111" : "#e6e6e6",
              marginHorizontal: 2,
            }}
          />
        ))}
      </View>
    );
  }

  // animation wrapper
  const MotionCard = ({ children }: { children: React.ReactNode }) => (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10 }}
      transition={{ type: "timing", duration: 280 }}
      style={{ width: "100%", alignItems: "center" }}
    >
      {children}
    </MotiView>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 36,
      }}
    >
      <ProgressDots />

      <AnimatePresence exitBeforeEnter>
        {step === 0 && (
          <MotionCard key="0">
            <Sparkles width={36} height={36} color="#111" />
            <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 12 }}>
              Welcome to Chuzly
            </Text>
            <Text
              style={{
                color: "#6b7280",
                textAlign: "center",
                marginTop: 10,
                paddingHorizontal: 6,
              }}
            >
              Plan events faster. Suggest options, vote and share with friends.
            </Text>
            <View
              style={{ width: "100%", marginTop: 18, alignItems: "flex-end" }}
            >
              <TouchableOpacity
                onPress={() => next(1)}
                style={{
                  backgroundColor: "#111",
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Get started
                </Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 1 && (
          <MotionCard key="1">
            <Info width={32} height={32} color="#111" />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
              How it works
            </Text>
            <Text
              style={{
                color: "#6b7280",
                textAlign: "center",
                marginTop: 10,
                paddingHorizontal: 6,
              }}
            >
              Quick walkthrough — swipe images or tap next to see steps.
            </Text>

            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 14, width: windowW - 40 }}
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
                  style={{
                    width: windowW - 40,
                    height: 180,
                    borderRadius: 12,
                    resizeMode: "cover",
                    marginRight: 8,
                  }}
                />
              ))}
            </ScrollView>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setImageIndex((p) => Math.max(p - 1, 0));
                  scrollRef.current?.scrollTo({
                    x: Math.max(0, (imageIndex - 1) * (windowW - 40)),
                    animated: true,
                  });
                }}
                disabled={imageIndex === 0}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: imageIndex === 0 ? "#efefef" : "#fff",
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              >
                <Text style={{ color: imageIndex === 0 ? "#9ca3af" : "#111" }}>
                  ← Back
                </Text>
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
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: "#111",
                  }}
                >
                  <Text style={{ color: "#fff" }}>Next →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => next(2)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: "#111",
                  }}
                >
                  <Text style={{ color: "#fff" }}>Continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </MotionCard>
        )}

        {step === 2 && (
          <MotionCard key="2">
            <User width={32} height={32} color="#111" />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
              Your name
            </Text>
            <Text
              style={{
                color: "#6b7280",
                textAlign: "center",
                marginTop: 10,
                paddingHorizontal: 6,
              }}
            >
              How you&apos;ll appear to others in events.
            </Text>
            <TextInput
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              style={{
                marginTop: 12,
                width: "100%",
                borderColor: "#e5e7eb",
                borderWidth: 1,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: "#fff",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 14,
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => prev()}
                style={{ paddingVertical: 10, paddingHorizontal: 12 }}
              >
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => next(3)}
                disabled={!name.trim()}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  backgroundColor: !name.trim() ? "#e5e7eb" : "#111",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: !name.trim() ? "#9ca3af" : "#fff" }}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 3 && (
          <MotionCard key="3">
            <Palette width={32} height={32} color="#111" />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
              Pick a color
            </Text>
            <Text
              style={{
                color: "#6b7280",
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 6,
              }}
            >
              Choose your avatar color for voting and messages.
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 10,
                marginTop: 14,
              }}
            >
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setColor(c)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 48,
                    backgroundColor: c,
                    borderWidth: color === c ? 3 : 1,
                    borderColor: color === c ? "#111" : "#e5e7eb",
                    margin: 6,
                  }}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 18,
              }}
            >
              <TouchableOpacity
                onPress={() => prev()}
                style={{ paddingVertical: 10 }}
              >
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => next(4)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: "#111",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff" }}>Preview</Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 4 && (
          <MotionCard key="4">
            <BadgeCheck width={32} height={32} color="#111" />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
              Here’s your profile
            </Text>
            <Text
              style={{
                color: "#6b7280",
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 6,
              }}
            >
              You can change this later from settings.
            </Text>

            <View style={{ alignItems: "center", marginTop: 16 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 72,
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              />
              <Text style={{ marginTop: 8, fontWeight: "600" }}>
                {name || "—"}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 18,
              }}
            >
              <TouchableOpacity
                onPress={() => prev()}
                style={{ paddingVertical: 10 }}
              >
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNameSubmit}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: "#111",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff" }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}

        {step === 5 && (
          <MotionCard key="5">
            <PartyPopper width={32} height={32} color="#111" />
            <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
              You&apos;re ready!
            </Text>
            <Text
              style={{
                color: "#6b7280",
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 6,
              }}
            >
              Time to create your first event or explore the dashboard.
            </Text>

            <View style={{ width: "100%", marginTop: 14 }}>
              <TouchableOpacity
                onPress={async () => {
                  await finishOnboarding();
                  router.push("/event/create-event");
                }}
                style={{
                  backgroundColor: "#111",
                  paddingVertical: 12,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Create Event
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await finishOnboarding();
                  router.push("/");
                }}
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ textAlign: "center" }}>Go to Dashboard</Text>
              </TouchableOpacity>
            </View>
          </MotionCard>
        )}
      </AnimatePresence>
    </View>
  );
}
