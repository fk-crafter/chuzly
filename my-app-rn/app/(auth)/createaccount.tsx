import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import GoogleIcon from "../../components/GoogleIcon";

export default function CreateAccountScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const validations = {
    length: formData.password.length >= 12,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const handleSubmit = async () => {
    if (!passwordsMatch) {
      alert("The passwords do not match.");
      return;
    }
    if (!Object.values(validations).every(Boolean)) {
      alert("The password does not meet all the rules.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!res.ok) throw new Error("Registration failed");

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error during registration. See console.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordRule = ({ valid, text }: { valid: boolean; text: string }) => (
    <Text className={`text-xs ${valid ? "text-green-600" : "text-red-500"}`}>
      {valid ? "✔" : "✘"} {text}
    </Text>
  );

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-6 left-6"
      >
        <Text className="text-gray-500 text-sm">← Back</Text>
      </TouchableOpacity>

      <View className="items-center mb-10">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-12 h-12 rounded-full"
        />
        <Text className="text-2xl font-bold mt-4">Create your account</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-base font-medium mb-1">Full Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={(val) => handleChange("name", val)}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          />
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Email</Text>
          <TextInput
            value={formData.email}
            onChangeText={(val) => handleChange("email", val)}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          />
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Password</Text>
          <View className="relative">
            <TextInput
              value={formData.password}
              onChangeText={(val) => handleChange("password", val)}
              placeholder="Your password"
              secureTextEntry={!showPassword}
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-3"
            >
              <Text className="text-sm text-blue-600">
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowRules((p) => !p)}
            className="mt-2"
          >
            <Text className="text-xs text-gray-500">Password rules</Text>
          </TouchableOpacity>
          {showRules && (
            <View className="mt-2 space-y-1">
              <PasswordRule
                valid={validations.length}
                text="Min 12 characters"
              />
              <PasswordRule
                valid={validations.uppercase}
                text="At least 1 uppercase"
              />
              <PasswordRule
                valid={validations.lowercase}
                text="At least 1 lowercase"
              />
              <PasswordRule
                valid={validations.number}
                text="At least 1 number"
              />
              <PasswordRule
                valid={validations.special}
                text="At least 1 special character"
              />
            </View>
          )}
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Confirm Password</Text>
          <View className="relative">
            <TextInput
              value={formData.confirmPassword}
              onChangeText={(val) => handleChange("confirmPassword", val)}
              placeholder="Confirm password"
              secureTextEntry={!showConfirmPassword}
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-3"
            >
              <Text className="text-sm text-blue-600">
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {formData.confirmPassword.length > 0 && (
            <Text
              className={`mt-1 text-xs ${
                passwordsMatch ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordsMatch
                ? "✔ Password confirmed"
                : "✘ The passwords do not match"}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="mt-6 w-full py-4 rounded-full bg-black"
      >
        <Text className="text-white text-center font-semibold text-base">
          {loading ? "Creating account..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="space-y-3">
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3">
          <GoogleIcon width={20} height={20} />
          <Text className="ml-2 text-base font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3">
          <AntDesign name="github" size={20} color="#000" />
          <Text className="ml-2 text-base font-medium">
            Continue with GitHub
          </Text>
        </TouchableOpacity>
        <View className="relative">
          <TouchableOpacity
            disabled
            className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3 opacity-50"
          >
            <FontAwesome name="apple" size={22} color="#000" />
            <Text className="ml-2 text-base font-medium">
              Continue with Apple
            </Text>
          </TouchableOpacity>
          <View className="absolute top-2 right-4 bg-yellow-400 px-2 py-0.5 rounded -rotate-12">
            <Text className="text-[10px] font-bold text-black">
              COMING SOON
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push("/login")} className="mt-6">
        <Text className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Text className="text-blue-600 font-semibold">Login</Text>
        </Text>
      </TouchableOpacity>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <View className="bg-white rounded-xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold mb-2">Account created 🎉</Text>
            <Text className="text-gray-600 mb-4">
              Please check your email to verify before logging in.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowSuccess(false);
                router.replace("/login");
              }}
              className="w-full py-3 rounded-full bg-black"
            >
              <Text className="text-white text-center font-semibold">
                Continue to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
