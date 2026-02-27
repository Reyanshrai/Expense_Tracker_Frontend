import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";

type addExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, amount: number) => void;
};

export default function addExpenseModal({
  visible,
  onClose,
  onSave,
}: addExpenseModalProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

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
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Add Expense
          </Text>

          <TextInput
            placeholder="Expense title"
            placeholderTextColor={colors.subtext}
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              padding: 12,
              color: colors.text,
              marginBottom: 12,
            }}
          />

          <TextInput
            placeholder="Amount"
            placeholderTextColor={colors.subtext}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              padding: 12,
              color: colors.text,
              marginBottom: 16,
            }}
          />

          <TouchableOpacity
            onPress={() => {
              if (!title || !amount) return;
              onSave(title, Number(amount));
              setTitle("");
              setAmount("");
            }}
            style={{
              backgroundColor: "#4ECDC4",
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Save Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 12, alignItems: "center" }}
          >
            <Text style={{ color: colors.subtext }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}