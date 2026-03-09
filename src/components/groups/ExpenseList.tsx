import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { deleteGroupExpense } from "@/src/services/expense";
import { showConfirmation, showSuccess } from "@/src/utils/errorHandler";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidByEmail: string;
}

interface Props {
  expenses: Expense[];
  user: any;
  userIsAdmin: boolean;
  onEdit: (expense: Expense) => void;
  onAddExpense?: () => void;
}

export default function ExpenseList({ expenses, user, userIsAdmin, onEdit, onAddExpense }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [menuOpenForExpense, setMenuOpenForExpense] = useState<string | null>(null);

  const canEditExpense = (expense: Expense): boolean => {
    if (!user) return false;
    if (expense.paidByEmail === user.email) return true;
    return userIsAdmin;
  };

  const handleDelete = (expense: Expense) => {
    showConfirmation(
      "Delete Expense",
      `Are you sure you want to delete "${expense.title}"?`,
      async () => {
        try {
          await deleteGroupExpense(expense.id);
          showSuccess("Deleted", "Expense deleted successfully");
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      },
      "Delete"
    );
    setMenuOpenForExpense(null);
  };

  const toggleMenu = (expenseId: string) => {
    setMenuOpenForExpense(menuOpenForExpense === expenseId ? null : expenseId);
  };

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="receipt-outline"
        title="No expenses yet"
        subtitle="Add your first expense to start tracking"
        actionLabel={onAddExpense ? "Add Expense" : undefined}
        onAction={onAddExpense}
      />
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginBottom: 12,
        }}
      >
        Expenses
      </Text>

      {expenses.map((item) => (
        <View
          key={item.id}
          style={{
            padding: 14,
            marginBottom: 12,
            borderRadius: 12,
            backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>
                {item.title}
              </Text>
              <Text style={{ color: colors.subtext, marginTop: 4 }}>
                ₹{item.amount.toLocaleString()}
              </Text>
              <Text
                style={{
                  color: colors.subtext,
                  marginTop: 2,
                  fontSize: 12,
                }}
              >
                Paid by {item.paidByEmail}
              </Text>
            </View>

            {/* 3-dot menu */}
            {canEditExpense(item) && (
              <View>
                <TouchableOpacity
                  onPress={() => toggleMenu(item.id)}
                  style={{ padding: 4 }}
                >
                  <Text style={{ color: colors.subtext, fontSize: 20 }}>
                    ⋮
                  </Text>
                </TouchableOpacity>

                {/* Menu dropdown */}
                {menuOpenForExpense === item.id && (
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 30,
                      backgroundColor: isDark ? "#2a2a2a" : "#fff",
                      borderRadius: 8,
                      padding: 8,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                      zIndex: 1000,
                      minWidth: 120,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        onEdit(item);
                        setMenuOpenForExpense(null);
                      }}
                      style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                    >
                      <Text style={{ color: colors.text }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item)}
                      style={{ paddingVertical: 8, paddingHorizontal: 12 }}
                    >
                      <Text style={{ color: "#FF6B6B" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
