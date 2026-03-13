import Avatar from "@/src/components/ui/Avatar";
import EmptyState from "@/src/components/ui/EmptyState";
import Skeleton, { SkeletonList } from "@/src/components/ui/Skeleton";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidByEmail: string;
  paidByName?: string;
  createdAt?: any;
  category?: string;
}

interface Props {
  expenses: Expense[];
  loading: boolean;
  user: any;
  userIsAdmin: boolean;
  onEdit: (expense: Expense) => void;
  onAddExpense?: () => void;
}

export default function ExpensesTab({
  expenses,
  loading,
  user,
  userIsAdmin,
  onEdit,
  onAddExpense,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const canEditExpense = (expense: Expense): boolean => {
    if (!user) return false;
    if (expense.paidByEmail === user.email) return true;
    return userIsAdmin;
  };

  if (loading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom }}
      >
        <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />
        <SkeletonList count={3} />
      </ScrollView>
    );
  }

  if (expenses.length === 0) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 + insets.bottom }}
      >
        <EmptyState
          icon="receipt-outline"
          title="No expenses yet"
          subtitle="Add your first expense to start tracking"
          actionLabel={onAddExpense ? "Add Expense" : undefined}
          onAction={onAddExpense}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 + insets.bottom }}
    >
      {/* Add Expense Button */}
      {onAddExpense && (
        <TouchableOpacity
          onPress={onAddExpense}
          style={{
            backgroundColor: "#667eea",
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 }}>
            + Add Expense
          </Text>
        </TouchableOpacity>
      )}

      {/* Expense List - Compact Layout */}
      {expenses.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => canEditExpense(item) && onEdit(item)}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginBottom: 8,
            borderRadius: 10,
            backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Left: Avatar + Title and Paid by */}
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Avatar
                name={item.paidByName || item.paidByEmail}
                size={36}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 15, fontWeight: "600" }}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 2 }}>
                  Paid by {item.paidByName || item.paidByEmail.split('@')[0]}
                </Text>
              </View>
            </View>

            {/* Right: Amount */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
                ₹{item.amount.toLocaleString()}
              </Text>
              {canEditExpense(item) && (
                <Text style={{ color: colors.subtext, fontSize: 11, marginTop: 2 }}>Edit</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
