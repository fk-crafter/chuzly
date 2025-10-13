import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

export default function DateTimeInput({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().slice(0, 16).replace("T", " ");
      onChange(iso);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-base font-medium mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="border border-gray-300 rounded-xl px-4 py-3"
      >
        <Text>{value || "Select date & time"}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value ? new Date(value.replace(" ", "T")) : new Date()}
          mode="datetime"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
