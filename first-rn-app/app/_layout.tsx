import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

if (__DEV__) {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
}

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </QueryClientProvider>
  );
}
