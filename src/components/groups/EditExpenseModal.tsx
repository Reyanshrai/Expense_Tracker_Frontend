import { useTheme } from "@/src/context/themeContext";
import { updateGroupExpense } from "@/src/services/expense";
import { showError, showSuccess, validateAmount } from "@/src/utils/errorHandler";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  expense: {
    id: string;
    title: string;
    amount: number;
    paidByEmail: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditExpenseModal({
  visible,
  expense,
  onClose,
  onSuccess,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [title, setTitle] = useState(expense?.title || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [loading, setLoading] = useState(false);

  // Reset form when expense changes
  const handleClose = () => {
    setTitle(expense?.title || "");
    setAmount(expense?.amount?.toString() || "");
    onClose();
  };

  const handleSave = async () => {
    if (!expense) return;

    const newAmount = parseFloat(amount);
    if (!title.trim()) {
      showError("unknown", "Please enter a title");
      return;
    }
    if (!validateAmount(newAmount)) {
      showError("invalid_amount");
      return;
    }

    setLoading(true);
    try {
      await updateGroupExpense(
        expense.id,
        { title: title.trim(), amount: newAmount },
        expense.amount
      );
      showSuccess("Updated", "Expense updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
      showError("unknown", "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  if (!expense) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Edit Expense
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeBtn, { color: colors.subtext }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subtext }]}>
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Expense title"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
                  },
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.subtext }]}>
                Amount (₹)
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.subtext}
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
                  },
                ]}
              />
            </View>

            <Text style={[styles.paidBy, { color: colors.subtext }]}>
              Paid by: {expense.paidByEmail}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleClose}
              style={[
                styles.button,
                styles.cancelBtn,
                { borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={[styles.button, styles.saveBtn]}
            >
              <Text style={styles.saveText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeBtn: {
    fontSize: 20,
    padding: 4,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  paidBy: {
    fontSize: 13,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: "#4ECDC4",
  },
  cancelText: {
    fontWeight: "600",
    fontSize: 16,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
