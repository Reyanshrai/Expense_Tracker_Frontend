import Avatar from "@/src/components/ui/Avatar";
import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Balance {
  email: string;
  name?: string;
  amount: number; // positive = owed, negative = owes
}

interface Props {
  balances: Record<string, number>;
  currentUserEmail?: string;
}

export default function BalancesTab({ balances, currentUserEmail }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const balanceEntries = Object.entries(balances)
    .map(([email, amount]) => ({ email, amount }))
    .filter((b) => b.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  if (balanceEntries.length === 0) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 + insets.bottom }}
      >
        <EmptyState
          icon="wallet-outline"
          title="All settled up!"
          subtitle="Everyone has paid their share"
        />
      </ScrollView>
    );
  }

  const formatAmount = (amount: number): string => {
    return `₹${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom }}
    >
      {/* Summary Card */}
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
          Balance Summary
        </Text>

        {/* Total Owed / Owes */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
              padding: 12,
              borderLeftWidth: 3,
              borderLeftColor: "#4ECDC4",
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Total Owed</Text>
            <Text
              style={{
                color: "#4ECDC4",
                fontSize: 18,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {formatAmount(
                balanceEntries
                  .filter((b) => b.amount > 0)
                  .reduce((sum, b) => sum + b.amount, 0)
              )}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderRadius: 10,
              padding: 12,
              borderLeftWidth: 3,
              borderLeftColor: "#FF6B6B",
            }}
          >
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Total Owes</Text>
            <Text
              style={{
                color: "#FF6B6B",
                fontSize: 18,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {formatAmount(
                balanceEntries
                  .filter((b) => b.amount < 0)
                  .reduce((sum, b) => sum + Math.abs(b.amount), 0)
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Individual Balances */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Individual Balances
      </Text>

      {balanceEntries.map((item) => {
        const isOwed = item.amount > 0;
        const isCurrentUser = item.email === currentUserEmail;
        const displayName = item.email.split("@")[0];

        return (
          <View
            key={item.email}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
              borderLeftWidth: 3,
              borderLeftColor: isOwed ? "#4ECDC4" : "#FF6B6B",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Avatar
                name={displayName}
                size={44}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
                  {displayName}
                  {isCurrentUser && (
                    <Text style={{ color: colors.subtext, fontSize: 12 }}> (You)</Text>
                  )}
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 2 }}>
                  {item.email}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: isOwed ? "#4ECDC4" : "#FF6B6B",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {isOwed ? "+" : "-"}
                {formatAmount(item.amount)}
              </Text>
              <Text
                style={{
                  color: isOwed ? "#4ECDC4" : "#FF6B6B",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {isOwed ? "is owed" : "owes"}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
