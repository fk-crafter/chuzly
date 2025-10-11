import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Plus, Trash } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { useRouter } from "expo-router";
import { API_URL } from "@/config";

export default function CreateEventScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [eventName, setEventName] = useState("");
  const [votingDeadline, setVotingDeadline] = useState("");
  const [options, setOptions] = useState([
    { name: "", price: "", datetime: "" },
  ]);
  const [guests, setGuests] = useState([""]);

  const addOption = () =>
    setOptions([...options, { name: "", price: "", datetime: "" }]);
  const removeOption = (i: number) =>
    setOptions(options.filter((_, idx) => idx !== i));

  const addGuest = () => setGuests([...guests, ""]);

  const handleGuestChange = (i: number, val: string) => {
    const updated = [...guests];
    updated[i] = val;
    setGuests(updated);
  };

  const handleOptionChange = (
    i: number,
    field: keyof (typeof options)[0],
    val: string
  ) => {
    const updated = [...options];
    updated[i][field] = val;
    setOptions(updated);
  };

  const isStep1Valid = eventName.trim() !== "" && votingDeadline.trim() !== "";
  const isStep2Valid =
    options.length > 0 &&
    options.every(
      (opt) =>
        opt.name.trim() !== "" &&
        opt.price.trim() !== "" &&
        opt.datetime.trim() !== ""
    );
  const isStep3Valid = guests.some((g) => g.trim() !== "");

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <View className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <View
          className="bg-black h-2 rounded-full"
          style={{
            width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
          }}
        />
      </View>

      <AnimatePresence exitBeforeEnter>
        {step === 1 && (
          <MotiView
            key="step1"
            from={{ opacity: 0, translateX: direction === 1 ? 100 : -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: direction === 1 ? -100 : 100 }}
            transition={{ type: "timing", duration: 300 }}
            className="absolute inset-0 flex-1 items-center justify-center px-6"
          >
            <View className="w-full max-w-sm">
              <Text className="text-base font-medium mb-2">Event name</Text>
              <TextInput
                placeholder="Saturday plans"
                value={eventName}
                onChangeText={setEventName}
                className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
              />

              <Text className="text-base font-medium mb-2">
                Voting deadline
              </Text>
              <TextInput
                placeholder="YYYY-MM-DD HH:mm"
                value={votingDeadline}
                onChangeText={setVotingDeadline}
                className="border border-gray-300 rounded-xl px-4 py-3"
              />

              <TouchableOpacity
                onPress={() => {
                  if (!isStep1Valid) {
                    Alert.alert("Error", "Please fill in all fields.");
                    return;
                  }
                  setDirection(1);
                  setStep(2);
                }}
                className="bg-black rounded-full py-4 mt-8"
              >
                <Text className="text-center text-white font-semibold text-base">
                  Next →
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}

        {step === 2 && (
          <MotiView
            key="step2"
            from={{ opacity: 0, translateX: direction === 1 ? 100 : -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: direction === 1 ? -100 : 100 }}
            transition={{ type: "timing", duration: 300 }}
            className="absolute inset-0 flex-1 items-center justify-center px-6"
          >
            <View className="w-full max-w-sm">
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="space-y-4"
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {options.map((opt, i) => (
                  <View key={i} className="border p-4 rounded-xl space-y-3">
                    <TextInput
                      placeholder="Option name"
                      value={opt.name}
                      onChangeText={(val) => handleOptionChange(i, "name", val)}
                      className="border border-gray-300 rounded-xl px-4 py-3"
                    />
                    <TextInput
                      placeholder="Price"
                      keyboardType="numeric"
                      value={opt.price}
                      onChangeText={(val) =>
                        handleOptionChange(i, "price", val)
                      }
                      className="border border-gray-300 rounded-xl px-4 py-3"
                    />
                    <TextInput
                      placeholder="YYYY-MM-DD HH:mm"
                      value={opt.datetime}
                      onChangeText={(val) =>
                        handleOptionChange(i, "datetime", val)
                      }
                      className="border border-gray-300 rounded-xl px-4 py-3"
                    />
                    {i > 0 && (
                      <TouchableOpacity
                        onPress={() => removeOption(i)}
                        className="self-end"
                      >
                        <Trash size={20} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  onPress={addOption}
                  className="border border-gray-300 rounded-full py-4 flex-row items-center justify-center mt-2"
                >
                  <Plus size={20} color="black" />
                  <Text className="ml-2 font-medium">Add option</Text>
                </TouchableOpacity>

                <View className="flex-row gap-4 mt-8">
                  <TouchableOpacity
                    onPress={() => {
                      setDirection(-1);
                      setStep(1);
                    }}
                    className="flex-1 border border-gray-300 rounded-full py-4"
                  >
                    <Text className="text-center font-medium">← Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!isStep2Valid) {
                        Alert.alert("Error", "Please complete all options.");
                        return;
                      }
                      setDirection(1);
                      setStep(3);
                    }}
                    className="flex-1 bg-black rounded-full py-4"
                  >
                    <Text className="text-center text-white font-semibold">
                      Next →
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </MotiView>
        )}

        {step === 3 && (
          <MotiView
            key="step3"
            from={{ opacity: 0, translateX: direction === 1 ? 100 : -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: direction === 1 ? -100 : 100 }}
            transition={{ type: "timing", duration: 300 }}
            className="absolute inset-0 flex-1 items-center justify-center px-6"
          >
            <View className="w-full max-w-sm">
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="space-y-4"
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {guests.map((g, i) => (
                  <TextInput
                    key={i}
                    placeholder="Nickname"
                    value={g}
                    onChangeText={(val) => handleGuestChange(i, val)}
                    className="border border-gray-300 rounded-xl px-4 py-3"
                  />
                ))}

                <TouchableOpacity
                  onPress={addGuest}
                  className="border border-gray-300 rounded-full py-4 flex-row items-center justify-center"
                >
                  <Plus size={20} color="black" />
                  <Text className="ml-2 font-medium">Add guest</Text>
                </TouchableOpacity>

                <View className="flex-row gap-4 mt-8">
                  <TouchableOpacity
                    onPress={() => {
                      setDirection(-1);
                      setStep(2);
                    }}
                    className="flex-1 border border-gray-300 rounded-full py-4"
                  >
                    <Text className="text-center font-medium">← Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      if (!isStep3Valid) {
                        Alert.alert("Error", "Please add at least one guest.");
                        return;
                      }

                      try {
                        // Appel backend pour créer l'événement
                        const res = await fetch(`${API_URL}/events`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: eventName,
                            votingDeadline,
                            options,
                            guests,
                          }),
                        });

                        const data = await res.json();

                        if (res.ok) {
                          router.push(`/share-event?id=${data.id}`);
                        } else {
                          Alert.alert(
                            "Error",
                            data.message || "Failed to create event."
                          );
                        }
                      } catch (err) {
                        console.error("Error creating event", err);
                        Alert.alert("Error", "Something went wrong.");
                      }
                    }}
                    className="flex-1 bg-black rounded-full py-4"
                  >
                    <Text className="text-center text-white font-semibold">
                      Finish →
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}
