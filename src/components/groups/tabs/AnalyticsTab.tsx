import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { formatCurrency } from "@/src/hooks/useGroupAnalytics";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BudgetSection from "../BudgetSection";

interface Analytics {
  topSpender: { email: string; amount: number } | null;
  topOwed: { email: string; amount: number } | null;
  averageExpense: number;
  categoryBreakdown: Record<string, number>;
  totalExpenses: number;
}

interface Props {
  analytics: Analytics;
  budget: number;
  totalSpent: number;
  userIsAdmin: boolean;
  groupStatus: string;
  groupId: string;
}

export default function AnalyticsTab({ 
  analytics, 
  budget, 
  totalSpent, 
  userIsAdmin, 
  groupStatus,
  groupId 
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();
  
  // Calculate total amount from category breakdown
  const totalAmount = Object.values(analytics.categoryBreakdown).reduce(
    (sum, amount) => sum + amount,
    0
  );

  if (analytics.totalExpenses === 0) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 + insets.bottom }}
      >
        <EmptyState
          icon="bar-chart-outline"
          title="No data yet"
          subtitle="Add expenses to see analytics"
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom }}
    >
      {/* Budget Section */}
      <BudgetSection
        groupId={groupId}
        budget={budget}
        totalSpent={totalSpent}
        userIsAdmin={userIsAdmin}
        groupStatus={groupStatus}
      />

      {/* Summary Stats */}
      <View
        style={{
          backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
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
          Overview
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {/* Total Expenses */}
          <View
            style={{
              flex: 1,
              minWidth: 100,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Total Expenses</Text>
            <Text
              style={{
                color: "#667eea",
                fontSize: 20,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {analytics.totalExpenses}
            </Text>
          </View>

          {/* Total Amount */}
          <View
            style={{
              flex: 1,
              minWidth: 100,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Total Amount</Text>
            <Text
              style={{
                color: "#4ECDC4",
                fontSize: 20,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {formatCurrency(totalAmount)}
            </Text>
          </View>

          {/* Average */}
          <View
            style={{
              flex: 1,
              minWidth: 100,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Average</Text>
            <Text
              style={{
                color: "#45B7D1",
                fontSize: 20,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {formatCurrency(analytics.averageExpense)}
            </Text>
          </View>
        </View>
      </View>

      {/* Top Spender & Top Owed */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        {analytics.topSpender && (
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Top Spender</Text>
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

        {analytics.topOwed && (
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Owes Most</Text>
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
      </View>

      {/* Category Breakdown */}
      {Object.keys(analytics.categoryBreakdown).length > 0 && (
        <View
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
            borderRadius: 12,
            padding: 16,
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
            Spending by Category
          </Text>

          {Object.entries(analytics.categoryBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount], index) => {
              const total = totalAmount || 1;
              const percentage = Math.round((amount / total) * 100);

              return (
                <View key={category} style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ color: colors.text, fontSize: 14 }}>{category}</Text>
                    <Text style={{ color: colors.text, fontWeight: "500" }}>
                      {formatCurrency(amount)} ({percentage}%)
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: isDark ? "#333" : "#e0e0e0",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor:
                          index === 0
                            ? "#667eea"
                            : index === 1
                            ? "#4ECDC4"
                            : index === 2
                            ? "#45B7D1"
                            : "#96CEB4",
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      )}
    </ScrollView>
  );
}
