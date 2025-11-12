import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { API_URL } from "@/config";
import { PartyPopper, Trash } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";

export default function CreateEventScreen() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [eventName, setEventName] = useState("");
  const [votingDeadline, setVotingDeadline] = useState<string | null>(null);
  const [options, setOptions] = useState([
    { name: "", price: "", datetime: "" },
  ]);
  const [guests, setGuests] = useState([""]);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  const { data: pastEvents = [] } = useQuery({
    queryKey: ["pastEvents"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return [];

      const res = await fetch(`${API_URL}/events/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      return data.slice(-3);
    },
    enabled: !checkingAuth,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/(auth)/login");
        return;
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const handleOptionChange = (index: number, field: string, value: string) => {
    const updated = [...options];

    if (field === "price") {
      value = value.replace(/[^0-9.]/g, "");
    }

    updated[index][field as keyof (typeof updated)[number]] = value;
    setOptions(updated);
  };

  const addOption = () =>
    setOptions([...options, { name: "", price: "", datetime: "" }]);
  const removeOption = (i: number) =>
    setOptions((prev) => prev.filter((_, index) => index !== i));

  const handleGuestChange = (index: number, value: string) => {
    const updated = [...guests];
    updated[index] = value;
    setGuests(updated);
  };

  const addGuest = () => setGuests([...guests, ""]);

  const handleConfirmDate = (date: Date) => {
    if (selectedOptionIndex !== null) {
      const updated = [...options];
      updated[selectedOptionIndex].datetime = date.toISOString();
      setOptions(updated);
      setSelectedOptionIndex(null);
    } else {
      setVotingDeadline(date.toISOString());
    }
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    if (!votingDeadline) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a valid deadline date",
      });
      return;
    }

    if (new Date(votingDeadline) < new Date()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Voting deadline can't be in the past",
      });
      return;
    }

    const invalidOption = options.find((opt) => {
      if (!opt.datetime) return false;
      return new Date(opt.datetime) < new Date();
    });

    if (invalidOption) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "One of the options has a date in the past",
      });
      return;
    }

    if (guests.length === 0 || guests.every((g) => g.trim() === "")) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add at least one guest",
      });
      return;
    }

    const body = { eventName, votingDeadline, options, guests };

    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create event");
      }

      const data = await res.json();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Event created successfully!",
      });
      router.push(`/(protected)/share?id=${data.id}`);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while creating the event.",
      });
    }
  };

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;
  const isStep1Valid = eventName.trim() !== "" && !!votingDeadline;
  const isStep2Valid =
    options.length > 0 &&
    options.every(
      (opt) =>
        opt.name.trim() !== "" &&
        opt.datetime.trim() !== "" &&
        opt.price.trim() !== ""
    );

  if (checkingAuth)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-700">Checking authentication...</Text>
      </View>
    );

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-6 py-8"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="flex flex-row items-center justify-center gap-2 mb-6">
            <PartyPopper size={28} color="black" />
            <Text className="text-3xl font-bold text-center">
              Create a new event
            </Text>
          </View>

          <View className="w-full h-2 bg-gray-200 rounded-full mb-10 overflow-hidden">
            <View
              className="h-full bg-black rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>

          {step === 1 && (
            <Animated.View
              key="step1"
              entering={
                direction === 1
                  ? SlideInRight.duration(400)
                  : SlideInLeft.duration(400)
              }
            >
              <Text className="text-base mb-2 font-semibold">Event name</Text>
              <TextInput
                placeholder="Saturday plans"
                value={eventName}
                onChangeText={setEventName}
                className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              />

              <Text className="text-base mb-2 font-semibold">
                Voting deadline
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedOptionIndex(null);
                  setDatePickerVisible(true);
                }}
                className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              >
                <Text>
                  {votingDeadline
                    ? new Date(votingDeadline).toLocaleString()
                    : "Select date & time"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-black rounded-full py-4 mt-8"
                onPress={() => {
                  if (!isStep1Valid) {
                    Toast.show({
                      type: "error",
                      text1: "Error",
                      text2: "Please fill in all event details",
                    });
                    return;
                  }
                  setDirection(1);
                  setStep(2);
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Next →
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View
              key="step2"
              entering={
                direction === 1
                  ? SlideInRight.duration(400)
                  : SlideInLeft.duration(400)
              }
            >
              {options.map((opt, i) => (
                <View
                  key={i}
                  className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50"
                >
                  <Text className="text-sm font-semibold mb-1">
                    Option name
                  </Text>
                  <TextInput
                    placeholder="Ex: Pizza night"
                    value={opt.name}
                    onChangeText={(text) => handleOptionChange(i, "name", text)}
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                  />

                  <Text className="text-sm font-semibold mb-1">Price</Text>
                  <TextInput
                    placeholder="Ex: 20"
                    value={opt.price}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleOptionChange(i, "price", text)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
                  />

                  <Text className="text-sm font-semibold mb-1">
                    Date & Time
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedOptionIndex(i);
                      setDatePickerVisible(true);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <Text>
                      {opt.datetime
                        ? new Date(opt.datetime).toLocaleString()
                        : "Select date & time"}
                    </Text>
                  </TouchableOpacity>

                  {i > 0 && (
                    <TouchableOpacity
                      onPress={() => removeOption(i)}
                      className="mt-2 self-end p-2"
                    >
                      <Trash size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                onPress={addOption}
                className="border border-gray-300 rounded-full py-3 mb-4"
              >
                <Text className="text-center font-semibold">+ Add option</Text>
              </TouchableOpacity>

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="border border-gray-300 py-3 px-6 rounded-full"
                  onPress={() => {
                    setDirection(-1);
                    setStep(1);
                  }}
                >
                  <Text className="font-semibold">← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-black py-3 px-6 rounded-full"
                  onPress={() => {
                    if (!isStep2Valid) {
                      Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Please fill in all options",
                      });
                      return;
                    }
                    setDirection(1);
                    setStep(3);
                  }}
                >
                  <Text className="text-white font-semibold">Next →</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {step === 3 && (
            <Animated.View
              key="step3"
              entering={
                direction === 1
                  ? SlideInRight.duration(400)
                  : SlideInLeft.duration(400)
              }
            >
              {guests.map((g, i) => (
                <View key={i} className="mb-3 relative">
                  <TextInput
                    placeholder="Guest name"
                    value={g}
                    onChangeText={(text) => handleGuestChange(i, text)}
                    className="border border-gray-300 rounded-xl px-4 py-3"
                  />
                  {guests.length > 1 && (
                    <TouchableOpacity
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onPress={() =>
                        setGuests(guests.filter((_, idx) => idx !== i))
                      }
                    >
                      <Text className="text-red-500 font-semibold">X</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity
                onPress={addGuest}
                className="border border-gray-300 rounded-full py-3 mb-4"
              >
                <Text className="text-center font-semibold">+ Add guest</Text>
              </TouchableOpacity>

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="border border-gray-300 py-3 px-6 rounded-full"
                  onPress={() => {
                    setDirection(-1);
                    setStep(2);
                  }}
                >
                  <Text className="font-semibold">← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-black py-3 px-6 rounded-full"
                  onPress={handleSubmit}
                >
                  <Text className="text-white font-semibold">Finish →</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {pastEvents.length > 0 && (
            <View className="mt-12">
              <Text className="text-lg font-semibold mb-4">
                Previous events
              </Text>

              {pastEvents.map((event: any) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() =>
                    router.push({
                      pathname: "/(protected)/share",
                      params: { id: event.id },
                    })
                  }
                  className="border border-gray-200 rounded-2xl p-4 mb-3 bg-gray-50"
                >
                  <Text className="text-base font-semibold mb-1">
                    {event.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mb-1">
                    Guests: {event.guests?.length ?? 0} • Options:{" "}
                    {event.options?.length ?? 0}
                  </Text>
                  {event.votingDeadline && (
                    <Text className="text-xs text-gray-400">
                      Voting closed on:{" "}
                      {new Date(event.votingDeadline).toLocaleDateString()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />
    </>
  );
}
