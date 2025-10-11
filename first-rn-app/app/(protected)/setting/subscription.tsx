import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "../../../config";

export default function SubscriptionScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    plan: string;
    trialEndsAt?: string | null;
    createdAt: string;
    cancelAt?: string | null;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setProfile({
        plan: data.plan,
        trialEndsAt: data.trialEndsAt,
        createdAt: data.createdAt,
        cancelAt: data.cancelAt ?? null,
      });
    })();
  }, []);

  const choosePlan = () => router.push("/setting/choose-plan");

  const cancelSub = async () => {
    try {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      const res = await fetch(`${API_URL}/stripe/cancel-subscription`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setProfile((p) => (p ? { ...p, cancelAt: data.cancelAt } : p));
      Alert.alert(
        "Canceled",
        `Subscription will end on ${new Date(data.cancelAt).toLocaleDateString()}`
      );
    } catch {
      Alert.alert("Error", "Failed to cancel subscription");
    }
  };

  const undoCancel = async () => {
    try {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      await fetch(`${API_URL}/stripe/undo-cancel`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProfile((p) => (p ? { ...p, cancelAt: null } : p));
      Alert.alert("Restored", "Cancellation undone.");
    } catch {
      Alert.alert("Error", "Failed to undo cancellation");
    }
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Loading subscription…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold text-center mb-8">
        Your Subscription
      </Text>

      <View className="border rounded-2xl p-4 gap-4">
        <Row label="Current Plan">
          <Text
            className={`px-2 py-1 rounded ${profile.plan === "PRO" ? "bg-yellow-300" : "bg-gray-100"}`}
          >
            {profile.plan}
          </Text>
        </Row>

        {profile.trialEndsAt && profile.plan === "TRIAL" && (
          <Row label="Trial ends on">
            {new Date(profile.trialEndsAt).toLocaleDateString()}
          </Row>
        )}

        <Row label="Account created on">
          {new Date(profile.createdAt).toLocaleDateString()}
        </Row>

        {profile.cancelAt && (
          <Row label="Subscription ends on">
            {new Date(profile.cancelAt).toLocaleDateString()}
          </Row>
        )}

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            onPress={choosePlan}
            className="flex-1 bg-black rounded-full py-3"
          >
            <Text className="text-white text-center font-semibold">
              {profile.plan === "PRO" ? "Change Plan" : "Upgrade to PRO"}
            </Text>
          </TouchableOpacity>

          {profile.plan === "PRO" &&
            (profile.cancelAt ? (
              <TouchableOpacity
                onPress={undoCancel}
                className="flex-1 border rounded-full py-3"
              >
                <Text className="text-center font-semibold">
                  Undo cancellation
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={cancelSub}
                className="flex-1 border rounded-full py-3"
              >
                <Text className="text-center font-semibold">
                  Cancel subscription
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b">
      <Text className="text-gray-500">{label}</Text>
      <View>{children}</View>
    </View>
  );
}
