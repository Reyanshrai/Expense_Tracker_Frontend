import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Timestamp } from "firebase/firestore";
import { Text, View } from "react-native";

interface Settlement {
  id: string;
  from: string;
  to: string;
  fromName?: string;
  toName?: string;
  amount: number;
  payMode: string;
  settledAt: any;
}

interface Props {
  settlements: Settlement[];
  loading: boolean;
  groupStatus: string;
}

export default function SettlementHistory({
  settlements,
  loading,
  groupStatus,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  if (groupStatus === "active") return null;

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "";
    const date =
      timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={{ padding: 16, paddingTop: 0 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Settlement History
      </Text>

      {loading ? (
        <Text style={{ color: colors.subtext }}>Loading settlements...</Text>
      ) : settlements.length === 0 ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="No settlements yet"
          subtitle="Settlements will appear here after you complete the trip"
        />
      ) : (
        settlements.map((settlement) => (
          <View
            key={settlement.id}
            style={{
              padding: 14,
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
            }}
          >
            <Text style={{ color: colors.text, fontSize: 14 }}>
              {settlement.fromName || settlement.from} →{" "}
              {settlement.toName || settlement.to}
            </Text>
            <Text
              style={{
                color: colors.subtext,
                marginTop: 4,
                fontSize: 12,
              }}
            >
              ₹{settlement.amount.toLocaleString()} •{" "}
              {settlement.payMode.toUpperCase()} •{" "}
              {formatDate(settlement.settledAt)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
