import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { API_URL } from "../../../config";

type Profile = { plan: "FREE" | "TRIAL" | "PRO"; cancelAt?: string | null };

export default function ChoosePlanScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setProfile({ plan: data.plan, cancelAt: data.cancelAt ?? null });
    })();
  }, []);

  const selectPlan = async (plan: "FREE" | "PRO") => {
    const token = await Promise.resolve(localStorage?.getItem?.("token"));
    if (!token) return Alert.alert("Auth", "You must be logged in.");

    if (plan === "FREE") {
      if (profile?.plan === "FREE")
        return Alert.alert("Info", "Free plan is already active.");
      if (profile?.cancelAt) {
        return Alert.alert(
          "Scheduled",
          `You're already scheduled to switch to Free on ${new Date(profile.cancelAt).toLocaleDateString()}.`
        );
      }
      const res = await fetch(`${API_URL}/stripe/cancel-subscription`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile((p) => (p ? { ...p, cancelAt: data.cancelAt } : p));
      Alert.alert(
        "OK",
        `Your plan will switch to Free on ${new Date(data.cancelAt).toLocaleDateString()}.`
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/stripe/checkout-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.url) {
        // sur mobile, ouvrir dans le navigateur
        Alert.alert("Checkout", "Open the checkout URL from your web app.");
      } else {
        throw new Error(data.message || "Checkout failed");
      }
    } catch {
      Alert.alert("Error", "Failed to start checkout session");
    }
  };

  const undoCancel = async () => {
    const token = await Promise.resolve(localStorage?.getItem?.("token"));
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/stripe/undo-cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setProfile((p) => (p ? { ...p, cancelAt: null } : p));
      Alert.alert("OK", "Scheduled downgrade canceled. You remain on Pro.");
    } catch {
      Alert.alert("Error", "Unable to cancel scheduled downgrade");
    }
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading plans…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold text-center mb-8">
        Choose Your Plan
      </Text>

      <View className="gap-4">
        <View
          className={`rounded-2xl border p-5 ${profile.plan === "PRO" ? "ring-1 ring-purple-400" : ""}`}
        >
          <Text className="text-lg font-semibold mb-1">Pro</Text>
          <Text className="text-xl font-bold mb-1">$10.99 per month</Text>
          <Text className="text-sm text-gray-500 mb-4">
            Everything you need to plan fast
          </Text>
          <TouchableOpacity
            onPress={() => selectPlan("PRO")}
            className={`w-full rounded-full py-3 ${profile.plan === "PRO" ? "bg-gray-300" : "bg-black"}`}
            disabled={profile.plan === "PRO"}
          >
            <Text
              className={`text-center font-semibold ${profile.plan === "PRO" ? "text-gray-700" : "text-white"}`}
            >
              {profile.plan === "PRO" ? "Current plan" : "Upgrade"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="rounded-2xl border p-5">
          <Text className="text-lg font-semibold mb-1">Starter</Text>
          <Text className="text-xl font-bold mb-1">Free</Text>
          <Text className="text-sm text-gray-500 mb-4">
            For small plans with friends
          </Text>
          <TouchableOpacity
            onPress={() => selectPlan("FREE")}
            className={`w-full rounded-full py-3 ${profile.plan === "FREE" ? "bg-gray-300" : "bg-white border"}`}
            disabled={profile.plan === "FREE"}
          >
            <Text
              className={`text-center font-semibold ${profile.plan === "FREE" ? "text-gray-700" : "text-black"}`}
            >
              {profile.plan === "FREE" ? "Current plan" : "Select"}
            </Text>
          </TouchableOpacity>

          {profile.cancelAt && (
            <Text className="mt-2 text-xs text-gray-600">
              You will be switched to Free on{" "}
              {new Date(profile.cancelAt).toLocaleDateString()}.{" "}
              <Text onPress={undoCancel} className="underline">
                Cancel
              </Text>
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
