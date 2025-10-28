import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("token");
      const isAdmin = await AsyncStorage.getItem("isAdmin");

      if (!token || isAdmin !== "true") {
        router.replace("/(protected)/overview");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load users");
        router.replace("/(protected)/overview");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const changePlan = async (userId: string, plan: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await fetch(`${API_URL}/admin/users/${userId}/plan`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      Alert.alert("Updated", `Plan changed to ${plan}`);
    } catch {
      Alert.alert("Error", "Failed to update plan");
    }
  };

  const toggleRole = async (userId: string, makeAdmin: boolean) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await fetch(
        `${API_URL}/admin/users/${userId}/${makeAdmin ? "promote" : "demote"}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert(
        "Success",
        makeAdmin ? "Promoted to Admin" : "Demoted to User"
      );
    } catch {
      Alert.alert("Error", "Role update failed");
    }
  };

  const deleteUser = async (userId: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      Alert.alert("Deleted", "User removed");
    } catch {
      Alert.alert("Error", "Failed to delete user");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
        <Text className="mt-2 text-gray-600">Loading users...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </Text>

      {users.map((user) => (
        <View
          key={user.id}
          className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50"
        >
          <Text className="font-semibold text-lg">{user.name}</Text>
          <Text className="text-gray-500 mb-2">{user.email}</Text>

          <Text className="text-sm mb-1">Plan: {user.plan}</Text>
          <Text className="text-sm mb-3">
            Admin: {user.isAdmin ? "Yes" : "No"}
          </Text>

          <View className="flex-row flex-wrap gap-2">
            <TouchableOpacity
              onPress={() => toggleRole(user.id, !user.isAdmin)}
              className="bg-black px-4 py-2 rounded-full"
            >
              <Text className="text-white text-sm font-semibold">
                {user.isAdmin ? "Demote" : "Promote"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => changePlan(user.id, "PRO")}
              className="bg-yellow-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white text-sm font-semibold">Set PRO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteUser(user.id)}
              className="bg-red-600 px-4 py-2 rounded-full"
            >
              <Text className="text-white text-sm font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
