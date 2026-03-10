import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useGroupAnalytics } from "@/src/hooks/useGroupAnalytics";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";
import { useGroupSettlements } from "@/src/hooks/useGroupSettlements";
import { isGroupAdmin } from "@/src/services/group";
import { calculateBalances } from "@/src/utils/calculateBalances";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useContext, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import EditExpenseModal from "./EditExpenseModal";
import GroupHeader from "./GroupHeader";
import AnalyticsTab from "./tabs/AnalyticsTab";
import BalancesTab from "./tabs/BalancesTab";
import ExpensesTab from "./tabs/ExpensesTab";
import SettlementsTab from "./tabs/SettlementsTab";

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
  onAddExpense?: () => void;
}

export default function GroupDetailScreen({ group, onBack, onAddExpense }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { user } = useContext(authContext);
  const layout = useWindowDimensions();

  // Tab state
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "expenses", title: "Expenses" },
    { key: "balances", title: "Balances" },
    { key: "analytics", title: "Analytics" },
    { key: "settlements", title: "Settlements" },
  ]);

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
  const analytics = useGroupAnalytics(expenses);
  
  // Calculate total amount from expenses
  const totalAmount = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

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

  // Tab renderers
  const renderExpensesTab = () => (
    <ExpensesTab
      expenses={expenses}
      loading={loading}
      user={user}
      userIsAdmin={userIsAdmin}
      onEdit={handleEditExpense}
      onAddExpense={onAddExpense}
    />
  );

  const renderBalancesTab = () => (
    <BalancesTab
      balances={balances}
      currentUserEmail={user?.email || undefined}
    />
  );

  const renderAnalyticsTab = () => (
    <AnalyticsTab 
      analytics={analytics} 
      budget={budget}
      totalSpent={totalSpent}
      userIsAdmin={userIsAdmin}
      groupStatus={groupStatus}
      groupId={group.id}
    />
  );

  const renderSettlementsTab = () => (
    <SettlementsTab
      settlements={recordedSettlements}
      loading={settlementsLoading}
    />
  );

  const renderScene = SceneMap({
    expenses: renderExpensesTab,
    balances: renderBalancesTab,
    analytics: renderAnalyticsTab,
    settlements: renderSettlementsTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#667eea", height: 3 }}
      style={{
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? "#333" : "#e0e0e0",
      }}
      labelStyle={{
        color: colors.text,
        fontWeight: "600",
        fontSize: 13,
        textTransform: "none",
      }}
      activeColor="#667eea"
      inactiveColor={colors.subtext}
      pressColor="transparent"
      renderLabel={({ route, focused }: { route: any; focused: boolean }) => (
        <Text
          style={{
            color: focused ? "#667eea" : colors.subtext,
            fontWeight: focused ? "700" : "500",
            fontSize: 13,
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Compact Header */}
      <GroupHeader
        group={group}
        totalSpent={totalSpent}
        userIsAdmin={userIsAdmin}
        onBack={onBack}
      />

      {/* Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
        lazy={true}
        lazyPreloadDistance={1}
      />

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
