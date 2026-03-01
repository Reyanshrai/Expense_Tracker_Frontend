import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";
import { calculateBalances } from "@/src/utils/calculateBalances";

export default function GroupDetailScreen({ group, onBack }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const { expenses, loading, totalSpent } = useGroupExpenses(group.id);

  const balances = calculateBalances(expenses);
  console.log("BALANCES 👉", balances);

  useEffect(() => {}, [expenses, loading]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 🔙 HEADER */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, color: colors.text, marginTop: 8 }}>
          {group.name}
        </Text>

        <Text style={{ color: colors.subtext, marginTop: 4 }}>
          Total Spent: ₹{totalSpent}
        </Text>
      </View>

      {/* ⏳ LOADING */}
      {loading && (
        <Text style={{ padding: 16, color: colors.subtext }}>
          Loading expenses...
        </Text>
      )}

      {/* 📭 EMPTY STATE */}
      {!loading && expenses.length === 0 && (
        <Text style={{ padding: 16, color: colors.subtext }}>
          No expenses yet. Add one 👇
        </Text>
      )}

      {/* 📋 EXPENSE LIST */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 14,
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16 }}>
              {item.title}
            </Text>

            <Text style={{ color: colors.subtext, marginTop: 4 }}>
              ₹{item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
