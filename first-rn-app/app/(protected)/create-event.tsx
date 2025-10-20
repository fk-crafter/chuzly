import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";

export default function CreateEventScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");

  const handleAddDate = () => {
    if (!newDate.trim()) return;
    setDateOptions([...dateOptions, newDate]);
    setNewDate("");
  };

  const handleRemoveDate = (index: number) => {
    const updated = [...dateOptions];
    updated.splice(index, 1);
    setDateOptions(updated);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Missing name", "Please enter an event name");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          location,
          price: price ? Number(price) : null,
          dateOptions,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create event");
      }

      Alert.alert("🎉 Success", "Event created successfully!");
      router.push("/(protected)/event-list");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while creating the event.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 px-6 py-8"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-3xl font-bold mb-2">Create Event</Text>
        <Text className="text-gray-500 mb-6">
          Fill in the details to plan your event.
        </Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Event Name</Text>
          <TextInput
            placeholder="Movie Night"
            value={name}
            onChangeText={setName}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Description</Text>
          <TextInput
            placeholder="Bring snacks 🍿"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Location</Text>
          <TextInput
            placeholder="123 Main Street"
            value={location}
            onChangeText={setLocation}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2">Price (optional)</Text>
          <TextInput
            placeholder="20"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            className="border border-gray-300 rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Date Options</Text>

          {dateOptions.map((date, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center border border-gray-200 rounded-lg px-4 py-2 mb-2"
            >
              <Text>{date}</Text>
              <TouchableOpacity onPress={() => handleRemoveDate(index)}>
                <Text className="text-red-500 font-semibold">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View className="flex-row items-center gap-2">
            <TextInput
              placeholder="e.g. 2025-10-15 18:00"
              value={newDate}
              onChangeText={setNewDate}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            />
            <TouchableOpacity
              onPress={handleAddDate}
              className="bg-black px-4 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-black py-4 rounded-full mt-4"
        >
          <Text className="text-white text-center font-semibold text-base">
            Create Event
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
