import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Animated, Text } from "react-native";

interface Props {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export default function GroupsListHeader({ fadeAnim, slideAnim }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: colors.text,
        }}
      >
        Your Groups 👥
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.subtext,
          marginTop: 4,
        }}
      >
        Manage and track your shared expenses
      </Text>
    </Animated.View>
  );
}
