import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import GoogleIcon from "../../components/GoogleIcon";

export default function CreateAccountScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Back button */}
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
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold mt-4">Create your account</Text>
        <Text className="text-gray-500 text-center">
          Sign up to get started with Chuzly
        </Text>
      </View>

      <View className="space-y-3">
        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-xl py-3">
          <GoogleIcon />
          <Text className="ml-2 text-base font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full flex-row items-center justify-center border border-gray-300 rounded-full py-3">
          <AntDesign name="github" size={20} color="#000" />
          <Text className="ml-2 text-base font-medium">
            Continue with GitHub
          </Text>
        </TouchableOpacity>

        <View className="relative">
          <TouchableOpacity
            disabled
            className="w-full flex-row items-center justify-center border border-gray-300 rounded-full py-3 opacity-50"
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

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-gray-400 text-sm">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-base font-medium mb-1">Full Name</Text>
          <TextInput
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
          />
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Email</Text>
          <TextInput
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Password</Text>
          <View className="relative">
            <TextInput
              placeholder="Your password"
              secureTextEntry
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
            />
            <TouchableOpacity className="absolute right-3 top-3">
              <Text className="text-sm text-blue-600">Show</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-base font-medium mb-1">Confirm Password</Text>
          <View className="relative">
            <TextInput
              placeholder="Confirm password"
              secureTextEntry
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
            />
            <TouchableOpacity className="absolute right-3 top-3">
              <Text className="text-sm text-blue-600">Show</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity className="mt-6 w-full py-4 rounded-full bg-black">
        <Text className="text-white text-center font-semibold text-base">
          Create Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")} className="mt-6">
        <Text className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Text className="text-black font-semibold">Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
