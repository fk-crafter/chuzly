import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";
import { useRouter } from "expo-router";
import { Wallet, Sparkles, Crown, Check, Info } from "lucide-react-native";

export default function ChoosePlanScreen() {
  const router = useRouter();
  const [plan, setPlan] = useState<"FREE" | "TRIAL" | "PRO" | null>(null);
  const [cancelAt, setCancelAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlan(data.plan);
        setCancelAt(data.cancelAt || null);
      } catch {
        Alert.alert("Error", "Unable to load your plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSelectPlan = async (selected: "FREE" | "PRO") => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return Alert.alert("Error", "You must be logged in.");

    if (selected === "FREE") {
      if (plan === "FREE")
        return Alert.alert("Info", "Free plan is already active.");
      if (cancelAt) {
        return Alert.alert(
          "Info",
          `You are already scheduled to switch to Free on ${new Date(
            cancelAt
          ).toLocaleDateString()}.`
        );
      }

      try {
        const res = await fetch(`${API_URL}/stripe/cancel-subscription`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCancelAt(data.cancelAt);
        Alert.alert(
          "✅ Success",
          `Your plan will switch to Free on ${new Date(
            data.cancelAt
          ).toLocaleDateString()}.`
        );
      } catch {
        Alert.alert("Error", "Failed to cancel subscription.");
      }
      return;
    }

    try {
      const res = await fetch(`${API_URL}/stripe/checkout-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.url) {
        await Linking.openURL(data.url);
      } else {
        Alert.alert("Error", "Failed to start checkout session.");
      }
    } catch {
      Alert.alert("Error", "Payment connection failed.");
    }
  };

  const handleCancelScheduledDowngrade = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/stripe/undo-cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setCancelAt(null);
      Alert.alert("✅ Canceled", "You remain on Pro.");
    } catch {
      Alert.alert("Error", "Unable to cancel scheduled downgrade.");
    }
  };

  const openPortal = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/stripe/portal-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) await Linking.openURL(data.url);
      else Alert.alert("Error", "Billing portal unavailable.");
    } catch {
      Alert.alert("Error", "Unable to open Stripe portal.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading plans…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex-row items-center justify-center mb-8">
        <Wallet size={28} color="black" strokeWidth={2.2} />
        <Text className="text-3xl font-bold text-center ml-2">
          Choose Your Plan
        </Text>
      </View>

      <PlanCard
        title="Starter"
        subtitle="For small plans with friends"
        price="Free"
        features={[
          "Create events",
          "Share with a link",
          "Basic voting (dates & places)",
        ]}
        icon={<Sparkles size={20} color="black" />}
        isCurrent={plan === "FREE"}
        onPress={() => handleSelectPlan("FREE")}
        cancelAt={cancelAt}
        onCancelDowngrade={handleCancelScheduledDowngrade}
      />

      <PlanCard
        title="Pro"
        subtitle="Everything you need to plan fast"
        price="$10.99/month"
        features={["Unlimited events", "Access to chat"]}
        icon={<Crown size={20} color="black" />}
        isCurrent={plan === "PRO"}
        onPress={() => handleSelectPlan("PRO")}
        onManage={openPortal}
        popular
      />

      <TouchableOpacity
        onPress={() => router.push("/(protected)/setting")}
        className="mt-10 border border-gray-300 py-4 rounded-full"
      >
        <Text className="text-black text-center font-semibold text-base">
          Back to Settings
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function PlanCard({
  title,
  subtitle,
  price,
  features,
  isCurrent,
  icon,
  onPress,
  cancelAt,
  onCancelDowngrade,
  onManage,
  popular,
}: any) {
  return (
    <View
      className={`border rounded-2xl p-6 mb-6 bg-gray-50 ${
        isCurrent ? "border-black" : "border-gray-300"
      }`}
    >
      {popular && !isCurrent && (
        <View className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">Most popular</Text>
        </View>
      )}

      {isCurrent && (
        <View className="absolute -top-3 left-1/2 -translate-x-[25%] bg-gray-900 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">Current plan</Text>
        </View>
      )}

      <View className="flex-row items-center gap-2 mb-2">
        {icon}
        <Text className="text-xl font-bold">{title}</Text>
      </View>
      <Text className="text-gray-600 mb-2">{subtitle}</Text>
      <Text className="text-2xl font-bold mb-4">{price}</Text>

      {features.map((f: string, i: number) => (
        <View key={i} className="flex-row items-center mb-1">
          <Check size={16} color="green" />
          <Text className="text-gray-700 ml-1">{f}</Text>
        </View>
      ))}

      <TouchableOpacity
        onPress={onPress}
        disabled={isCurrent}
        className={`mt-6 py-4 rounded-full ${
          isCurrent ? "bg-gray-200" : "bg-black"
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            isCurrent ? "text-black" : "text-white"
          }`}
        >
          {isCurrent ? "Current Plan" : "Select"}
        </Text>
      </TouchableOpacity>

      {cancelAt && (
        <View className="flex-row items-center mt-3">
          <Info size={14} color="gray" />
          <Text className="text-sm text-gray-600 ml-1">
            You will be switched to Free on{" "}
            {new Date(cancelAt).toLocaleDateString()}.
            <Text
              onPress={onCancelDowngrade}
              className="text-blue-600 underline ml-1"
            >
              Cancel
            </Text>
          </Text>
        </View>
      )}

      {isCurrent && title === "Pro" && (
        <TouchableOpacity onPress={onManage} className="mt-3">
          <Text className="text-sm text-center text-blue-600">
            Manage your subscription
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
