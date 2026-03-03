import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";
import { calculateBalances } from "@/src/utils/calculateBalances";
import { calculateSettlements } from "@/src/utils/settlement";
import { addSettlement } from "@/src/services/addSettlement";
import { useState } from "react";

type Props = {
  visible: boolean;
  group: any;
  onClose: () => void;
};

export default function SplitPreviewModal({ visible, group, onClose }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [payMode, setPayMode] = useState<"cash" | "upi">("cash");

  const { expenses, loading } = useGroupExpenses(group?.id);

  if (!group) return null;

  const balances = calculateBalances(expenses);
  const settlements = calculateSettlements(balances);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: "70%",
          }}
        >
          {/* HEADER */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Split Summary
          </Text>

          {/* LOADING */}
          {loading && (
            <Text style={{ color: colors.subtext }}>Calculating split...</Text>
          )}

          {/* EMPTY */}
          {!loading && settlements.length === 0 && (
            <Text style={{ color: colors.subtext, marginTop: 20 }}>
              Nothing to split yet.
            </Text>
          )}

          {/* LIST */}
          <FlatList
            data={settlements}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: colors.text }}>
                  {item.from} → {item.to}
                </Text>

                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "600",
                    marginTop: 4,
                  }}
                >
                  ₹{item.amount}
                </Text>
              </View>
            )}
          />

          <View style={{ flexDirection: "row", marginVertical: 12 }}>
            <TouchableOpacity
              onPress={() => setPayMode("cash")}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: payMode === "cash" ? "#4ECDC4" : colors.border,
                marginRight: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: payMode === "cash" ? "#fff" : colors.text }}
              >
                Cash
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPayMode("upi")}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: payMode === "upi" ? "#4ECDC4" : colors.border,
                alignItems: "center",
              }}
            >
              <Text style={{ color: payMode === "upi" ? "#fff" : colors.text }}>
                UPI
              </Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <TouchableOpacity
            style={{
              backgroundColor: "#4ECDC4",
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
            }}
            onPress={async () => {
              for (const s of settlements) {
                await addSettlement({
                  ...s,
                  groupId: group.id,
                  payMode,
                });
              }
              onClose();
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Settle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 16, alignItems: "center" }}
          >
            <Text style={{ color: colors.subtext }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
