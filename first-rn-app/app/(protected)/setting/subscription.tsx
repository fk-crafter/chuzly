import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";
import { useRouter } from "expo-router";
import { CreditCard } from "lucide-react-native";
import Toast from "react-native-toast-message";

type SubscriptionInfo = {
  plan: "FREE" | "TRIAL" | "PRO";
  currentPeriodEnd?: string | null;
  cancelAt?: string | null;
  status?: string;
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/stripe/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSub(data);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load subscription details.",
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  const openStripePortal = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/stripe/portal-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) await Linking.openURL(data.url);
      else Alert.alert("Error", "Unable to open billing portal.");
    } catch (err) {
      console.error("Stripe portal error:", err);
      Alert.alert("Error", "Unable to open Stripe portal.");
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-600 mt-3">Loading subscription...</Text>
      </View>
    );
  }

  if (!sub) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-white">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          No subscription data available.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(protected)/setting/choose-plan")}
          className="bg-black px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go to Plans</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const planLabel =
    sub.plan === "PRO"
      ? "Pro Plan"
      : sub.plan === "FREE"
        ? "Free Plan"
        : "Trial Plan";

  const planDescription =
    sub.plan === "PRO"
      ? "Enjoy full access to all features, including unlimited events and chat."
      : sub.plan === "FREE"
        ? "You’re using the free plan with limited features."
        : "Trial users enjoy temporary Pro benefits.";

  return (
    <ScrollView
      className="flex-1 bg-white px-6 py-10"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="flex flex-row items-center justify-center gap-2 mb-8">
        <CreditCard size={28} color="black" strokeWidth={2.2} />
        <Text className="text-3xl font-bold text-center">
          Subscription Details
        </Text>
      </View>

      <View className="border border-gray-200 rounded-2xl p-6 mb-6 bg-gray-50">
        <Text className="text-xl font-bold mb-1">{planLabel}</Text>
        <Text className="text-gray-600 mb-3">{planDescription}</Text>

        {sub.status && (
          <Text className="text-sm text-gray-600 mb-1">
            Status: <Text className="font-semibold">{sub.status}</Text>
          </Text>
        )}

        {sub.currentPeriodEnd && (
          <Text className="text-sm text-gray-600 mb-1">
            Current Period Ends:{" "}
            <Text className="font-semibold">
              {new Date(sub.currentPeriodEnd).toLocaleDateString()}
            </Text>
          </Text>
        )}

        {sub.cancelAt && (
          <Text className="text-sm text-gray-600">
            Plan will cancel on:{" "}
            <Text className="font-semibold">
              {new Date(sub.cancelAt).toLocaleDateString()}
            </Text>
          </Text>
        )}
      </View>

      {sub.plan === "PRO" && (
        <TouchableOpacity
          onPress={openStripePortal}
          className="bg-black py-4 rounded-full"
        >
          <Text className="text-white text-center font-semibold text-base">
            Manage Subscription in Stripe
          </Text>
        </TouchableOpacity>
      )}

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
