import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";

type Props = {
  group: any;
  onBack: () => void;
};

export default function GroupDetailScreen({ group, onBack }: Props) {
  const { expenses, loading } = useGroupExpenses(group.id);
  console.log("GROUP EXPENSES 👉", expenses);
  console.log("GROUP ID FROM SCREEN 👉", group.id);
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  if (!group) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 🔙 Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            color: colors.text,
            marginLeft: 12,
            fontWeight: "600",
          }}
        >
          {group.name}
        </Text>
      </View>

      {/* 📊 Group Info */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.subtext }}>
          Total Spent
        </Text>

        <Text
          style={{
            fontSize: 28,
            color: colors.text,
            fontWeight: "700",
            marginTop: 4,
          }}
        >
          ₹{group.totalSpent}
        </Text>

        <Text
          style={{
            marginTop: 12,
            color: colors.subtext,
          }}
        >
          Members: {group.members}
        </Text>
      </View>

      {/* 📭 Empty state */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.6,
        }}
      >
        <Text style={{ color: colors.subtext }}>
          No expenses yet
        </Text>
      </View>
    </View>
  );
}