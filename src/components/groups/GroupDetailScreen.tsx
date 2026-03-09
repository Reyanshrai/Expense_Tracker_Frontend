import Skeleton, { SkeletonList } from "@/src/components/ui/Skeleton";
import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useGroupAnalytics } from "@/src/hooks/useGroupAnalytics";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";
import { useGroupSettlements } from "@/src/hooks/useGroupSettlements";
import { isGroupAdmin } from "@/src/services/group";
import { calculateBalances } from "@/src/utils/calculateBalances";
import { calculateSettlements } from "@/src/utils/settlement";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useContext, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import AnalyticsSection from "./AnalyticsSection";
import BalanceSummaryCard from "./BalanceSummaryCard";
import BudgetSection from "./BudgetSection";
import EditExpenseModal from "./EditExpenseModal";
import ExpenseList from "./ExpenseList";
import GroupHeader from "./GroupHeader";
import SettlementHistory from "./SettlementHistory";

interface Props {
  group: {
    id: string;
    name: string;
    status?: string;
    budget?: number;
    participants: any[];
    createdBy: string;
  };
  onBack: () => void;
}

export default function GroupDetailScreen({ group, onBack }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { user } = useContext(authContext);

  // Safety check for group
  if (!group || !group.id) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>Loading group...</Text>
      </View>
    );
  }

  const { expenses, loading, totalSpent } = useGroupExpenses(group.id);
  const { settlements: recordedSettlements, loading: settlementsLoading } =
    useGroupSettlements(group.id);
  const balances = calculateBalances(expenses);
  const calculatedSettlements = calculateSettlements(balances);
  const analytics = useGroupAnalytics(expenses);

  // Calculate user's balance in this group
  const { youOwe, youAreOwed } = useMemo(() => {
    if (!user || !balances) return { youOwe: 0, youAreOwed: 0 };
    
    // Try to find user's balance by uid or email
    const userEmail = user.email;
    const balance = balances[user.uid] ?? balances[userEmail ?? ""] ?? 0;
    
    return {
      youOwe: balance < 0 ? Math.abs(balance) : 0,
      youAreOwed: balance > 0 ? balance : 0,
    };
  }, [balances, user]);

  const userIsAdmin = user ? isGroupAdmin(group, user.uid) : false;
  const groupStatus = group.status || "active";
  const budget = group.budget || 0;

  // Edit expense state
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <GroupHeader
          group={group}
          totalSpent={totalSpent}
          userIsAdmin={userIsAdmin}
          onBack={onBack}
        />

        {/* Budget Section */}
        <BudgetSection
          groupId={group.id}
          budget={budget}
          totalSpent={totalSpent}
          userIsAdmin={userIsAdmin}
          groupStatus={groupStatus}
        />

        {/* Balance Summary Card */}
        {!loading && expenses.length > 0 && (
          <BalanceSummaryCard youOwe={youOwe} youAreOwed={youAreOwed} />
        )}

        {/* Analytics Section */}
        {!loading && <AnalyticsSection analytics={analytics} />}

        {/* Loading State */}
        {loading && (
          <View style={{ padding: 16 }}>
            <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />
            <SkeletonList count={3} />
          </View>
        )}

        {/* Expense List */}
        <ExpenseList
          expenses={expenses}
          user={user}
          userIsAdmin={userIsAdmin}
          onEdit={handleEditExpense}
        />

        {/* Settlement History */}
        <SettlementHistory
          settlements={recordedSettlements}
          loading={settlementsLoading}
          groupStatus={groupStatus}
        />
      </ScrollView>

      {/* Edit Expense Modal */}
      <EditExpenseModal
        visible={showEditModal}
        expense={editingExpense}
        onClose={() => {
          setShowEditModal(false);
          setEditingExpense(null);
        }}
        onSuccess={() => {}}
      />
    </View>
  );
}
