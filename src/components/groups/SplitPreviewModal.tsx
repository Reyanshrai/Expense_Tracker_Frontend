import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";
import { calculateBalances } from "@/src/utils/calculateBalances";
import { calculateSettlements } from "@/src/utils/settlement";

type Props = {
  visible: boolean;
  group: any;
  onClose: () => void;
};

export default function SplitPreviewModal({
  visible,
  group,
  onClose,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

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
            <Text style={{ color: colors.subtext }}>
              Calculating split...
            </Text>
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

          {/* FOOTER */}
          <TouchableOpacity
            style={{
              backgroundColor: "#4ECDC4",
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Settle
            </Text>
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