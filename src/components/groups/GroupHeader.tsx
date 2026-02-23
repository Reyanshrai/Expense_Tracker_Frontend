import { Animated, Text } from "react-native";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { styles } from "@/src/css/group.styles";

export default function GroupHeader({
  fadeAnim,
  slideAnim,
}: {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <Animated.View
      style={[
        styles.header,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Your Groups 👥
      </Text>
      <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
        Manage your group expenses effortlessly
      </Text>
    </Animated.View>
  );
}