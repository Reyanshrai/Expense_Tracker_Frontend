import { View, Text } from "react-native";
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

export default function GroupDetailScreen({ route }: any) {
  const { group } = route.params;
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, color: colors.text }}>
        {group.name}
      </Text>

      <Text style={{ marginTop: 8, color: colors.subtext }}>
        Members: {group.members}
      </Text>
    </View>
  );
}