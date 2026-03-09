import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Text, View } from "react-native";

interface Props {
  youOwe: number;
  youAreOwed: number;
}

export default function BalanceSummaryCard({ youOwe, youAreOwed }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const netBalance = youAreOwed - youOwe;
  const isPositive = netBalance >= 0;

  const formatAmount = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

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
        Your Balance 💰
      </Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* You Owe */}
        <View
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderRadius: 10,
            borderLeftWidth: 3,
            borderLeftColor: "#FF6B6B",
          }}
        >
          <Text style={{ color: colors.subtext, fontSize: 12 }}>You Owe</Text>
          <Text
            style={{
              color: "#FF6B6B",
              fontWeight: "600",
              fontSize: 18,
              marginTop: 4,
            }}
          >
            {formatAmount(youOwe)}
          </Text>
        </View>

        {/* You Are Owed */}
        <View
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: isDark ? "#2a2a2a" : "#fff",
            borderRadius: 10,
            borderLeftWidth: 3,
            borderLeftColor: "#4ECDC4",
          }}
        >
          <Text style={{ color: colors.subtext, fontSize: 12 }}>
            You Are Owed
          </Text>
          <Text
            style={{
              color: "#4ECDC4",
              fontWeight: "600",
              fontSize: 18,
              marginTop: 4,
            }}
          >
            {formatAmount(youAreOwed)}
          </Text>
        </View>
      </View>

      {/* Net Balance */}
      <View
        style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: isPositive
            ? isDark
              ? "#1a3a3a"
              : "#e8f8f5"
            : isDark
            ? "#3a1a1a"
            : "#fdeaea",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.subtext, fontSize: 12 }}>
          Net Balance
        </Text>
        <Text
          style={{
            color: isPositive ? "#4ECDC4" : "#FF6B6B",
            fontWeight: "700",
            fontSize: 24,
            marginTop: 4,
          }}
        >
          {isPositive ? "+" : ""}
          {formatAmount(Math.abs(netBalance))}
        </Text>
        <Text
          style={{
            color: isPositive ? "#4ECDC4" : "#FF6B6B",
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {isPositive ? "You are owed money" : "You owe money"}
        </Text>
      </View>
    </View>
  );
}
