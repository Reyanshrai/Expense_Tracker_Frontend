import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Timestamp } from "firebase/firestore";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
}

export default function SettlementsTab({ settlements, loading }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

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

  if (loading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom }}
      >
        <Text style={{ color: colors.subtext }}>Loading settlements...</Text>
      </ScrollView>
    );
  }

  if (settlements.length === 0) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 + insets.bottom }}
      >
        <EmptyState
          icon="checkmark-circle-outline"
          title="No settlements yet"
          subtitle="Settlements will appear here after payments are recorded"
        />
      </ScrollView>
    );
  }

  // Calculate total settled amount
  const totalSettled = settlements.reduce((sum, s) => sum + s.amount, 0);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 + insets.bottom }}
    >
      {/* Summary */}
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
            marginBottom: 8,
          }}
        >
          Settlement Summary
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <View>
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Total Settlements</Text>
            <Text style={{ color: "#4ECDC4", fontSize: 24, fontWeight: "700" }}>
              {settlements.length}
            </Text>
          </View>
          <View>
            <Text style={{ color: colors.subtext, fontSize: 12 }}>Total Amount</Text>
            <Text style={{ color: "#667eea", fontSize: 24, fontWeight: "700" }}>
              ₹{totalSettled.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Settlement List */}
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

      {settlements.map((settlement) => (
        <View
          key={settlement.id}
          style={{
            padding: 16,
            marginBottom: 12,
            borderRadius: 12,
            backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
          }}
        >
          {/* From -> To */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {settlement.fromName || settlement.from.split("@")[0]}
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 11 }}>
                {settlement.from}
              </Text>
            </View>

            <Text
              style={{
                color: colors.subtext,
                fontSize: 20,
                marginHorizontal: 8,
              }}
            >
              →
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {settlement.toName || settlement.to.split("@")[0]}
              </Text>
              <Text style={{ color: colors.subtext, fontSize: 11 }}>
                {settlement.to}
              </Text>
            </View>
          </View>

          {/* Amount & Details */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: isDark ? "#333" : "#e0e0e0",
            }}
          >
            <Text style={{ color: "#4ECDC4", fontSize: 18, fontWeight: "700" }}>
              ₹{settlement.amount.toLocaleString()}
            </Text>
            <Text style={{ color: colors.subtext, fontSize: 12 }}>
              {settlement.payMode.toUpperCase()} • {formatDate(settlement.settledAt)}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
