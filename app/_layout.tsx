import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from "@/src/context/themeContext";
import { AuthProvider } from "@/src/context/AuthContext";

function LayoutWithTheme() {
  const { isDark } = useTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <AppThemeProvider>
        <LayoutWithTheme />
      </AppThemeProvider>
    </AuthProvider>
  );
}
