import { useTheme } from "@/src/context/themeContext";
import { formatCurrency } from "@/src/hooks/useGroupAnalytics";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Text, View } from "react-native";

interface Analytics {
  topSpender: { email: string; amount: number } | null;
  topOwed: { email: string; amount: number } | null;
  averageExpense: number;
  categoryBreakdown: Record<string, number>;
  totalExpenses: number;
}

interface Props {
  analytics: Analytics;
}

export default function AnalyticsSection({ analytics }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  if (analytics.totalExpenses === 0) return null;

  return (
    <View
      style={{
        marginTop: 16,
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Analytics 📊
      </Text>

      {/* Analytics Grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {/* Top Spender */}
        {analytics.topSpender && (
          <View
            style={{
              flex: 1,
              minWidth: 140,
              padding: 12,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>
              Top Spender
            </Text>
            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                fontSize: 14,
                marginTop: 4,
              }}
              numberOfLines={1}
            >
              {analytics.topSpender.email.split("@")[0]}
            </Text>
            <Text style={{ color: "#4ECDC4", fontWeight: "600", marginTop: 2 }}>
              {formatCurrency(analytics.topSpender.amount)}
            </Text>
          </View>
        )}

        {/* Top Owed */}
        {analytics.topOwed && (
          <View
            style={{
              flex: 1,
              minWidth: 140,
              padding: 12,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>
              Owes Most
            </Text>
            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                fontSize: 14,
                marginTop: 4,
              }}
              numberOfLines={1}
            >
              {analytics.topOwed.email.split("@")[0]}
            </Text>
            <Text style={{ color: "#FF6B6B", fontWeight: "600", marginTop: 2 }}>
              {formatCurrency(analytics.topOwed.amount)}
            </Text>
          </View>
        )}

        {/* Average Expense */}
        <View
          style={{
            flex: 1,
            minWidth: 140,
            padding: 12,
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: colors.subtext, fontSize: 12 }}>
            Avg Expense
          </Text>
          <Text
            style={{
              color: "#45B7D1",
              fontWeight: "600",
              fontSize: 16,
              marginTop: 4,
            }}
          >
            {formatCurrency(analytics.averageExpense)}
          </Text>
          <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 2 }}>
            {analytics.totalExpenses} expenses
          </Text>
        </View>
      </View>

      {/* Category Breakdown */}
      {Object.keys(analytics.categoryBreakdown).length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              color: colors.subtext,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            Spending by Category
          </Text>
          {Object.entries(analytics.categoryBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => (
              <View
                key={category}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: isDark ? "#333" : "#e0e0e0",
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14 }}>
                  {category}
                </Text>
                <Text style={{ color: colors.text, fontWeight: "500" }}>
                  {formatCurrency(amount)}
                </Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}
