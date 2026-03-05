import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useGroupExpenses } from "@/src/hooks/useGroupExpenses";
import { useGroupSettlements } from "@/src/hooks/useGroupSettlements";
import { isGroupAdmin, updateGroupBudget, updateGroupStatus } from "@/src/services/group";
import { calculateBalances } from "@/src/utils/calculateBalances";
import { calculateSettlements } from "@/src/utils/settlement";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Timestamp } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#4ECDC4", text: "#fff" },
  completed: { bg: "#FF8E53", text: "#fff" },
  settled: { bg: "#9CA3AF", text: "#fff" },
};

// Budget Progress Bar Component
function BudgetProgressBar({
  spent,
  budget,
  colors,
}: {
  spent: number;
  budget: number;
  colors: any;
}) {
  if (!budget || budget <= 0) return null;

  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;

  return (
    <View style={{ marginTop: 12 }}>
      <View
        style={{
          height: 8,
          backgroundColor: colors.border,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: isOverBudget ? "#FF6B6B" : "#4ECDC4",
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}

export default function GroupDetailScreen({ group, onBack }: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { user } = useContext(authContext);

  const { expenses, loading, totalSpent } = useGroupExpenses(group.id);
  const { settlements: recordedSettlements, loading: settlementsLoading } = useGroupSettlements(group.id);
  const balances = calculateBalances(expenses);
  const calculatedSettlements = calculateSettlements(balances);

  const userIsAdmin = user ? isGroupAdmin(group, user.uid) : false;
  const groupStatus = group.status || "active";

  console.log("🎯 GroupDetailScreen - groupId:", group.id);
  console.log("🎯 GroupDetailScreen - groupStatus:", groupStatus);
  console.log("🎯 GroupDetailScreen - settlementsLoading:", settlementsLoading);
  console.log("🎯 GroupDetailScreen - recordedSettlements:", recordedSettlements);
  console.log("🎯 GroupDetailScreen - showSettlementHistory:", groupStatus !== "active");
  const budget = group.budget || 0;
  const remaining = budget - totalSpent;
  const isOverBudget = totalSpent > budget && budget > 0;

  // Budget editing state
  const [budgetInput, setBudgetInput] = useState(budget > 0 ? budget.toString() : "");
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const handleCompleteTrip = async () => {
    if (!userIsAdmin) {
      console.log("User is not admin, cannot complete trip");
      return;
    }
    try {
      await updateGroupStatus(group.id, "completed");
      console.log("Trip completed successfully");
    } catch (error) {
      console.error("Error completing trip:", error);
    }
  };

  const handleSaveBudget = async () => {
    if (!userIsAdmin || groupStatus !== "active") return;
    const newBudget = parseFloat(budgetInput);
    if (isNaN(newBudget) || newBudget < 0) return;
    try {
      await updateGroupBudget(group.id, newBudget);
      setIsEditingBudget(false);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };


  // Format date from Firestore Timestamp
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "";
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {}, [expenses, loading]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 🔙 HEADER */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, color: colors.text, marginTop: 8 }}>
          {group.name}
        </Text>

        <Text style={{ color: colors.subtext, marginTop: 4 }}>
          Total Spent: ₹{totalSpent}
        </Text>

        {/* Status Badge */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <View
            style={{
              backgroundColor: statusColors[groupStatus].bg,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                color: statusColors[groupStatus].text,
                fontSize: 12,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {groupStatus}
            </Text>
          </View>
        </View>

        {/* Complete Trip Button (Admin Only) */}
        {userIsAdmin && groupStatus === "active" && (
          <TouchableOpacity
            onPress={handleCompleteTrip}
            style={{
              marginTop: 12,
              backgroundColor: "#FF8E53",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Complete Trip
            </Text>
          </TouchableOpacity>
        )}

        {/* 💰 BUDGET SECTION */}
        <View
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Budget
          </Text>

          {/* Budget Display / Edit */}
          {isEditingBudget && userIsAdmin && groupStatus === "active" ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                placeholder="Enter budget"
                placeholderTextColor={colors.subtext}
                value={budgetInput}
                onChangeText={setBudgetInput}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 10,
                  color: colors.text,
                  backgroundColor: colors.background,
                }}
              />
              <TouchableOpacity
                onPress={handleSaveBudget}
                style={{
                  marginLeft: 8,
                  backgroundColor: "#4ECDC4",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditingBudget(false);
                  setBudgetInput(budget > 0 ? budget.toString() : "");
                }}
                style={{
                  marginLeft: 8,
                  backgroundColor: colors.border,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Budget Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: colors.subtext }}>Budget:</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    ₹{budget > 0 ? budget.toLocaleString() : "Not set"}
                  </Text>
                  {userIsAdmin && groupStatus === "active" && (
                    <TouchableOpacity
                      onPress={() => setIsEditingBudget(true)}
                      style={{ marginLeft: 8 }}
                    >
                      <Text style={{ color: "#4ECDC4", fontSize: 12 }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Total Spent Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: colors.subtext }}>Total Spent:</Text>
                <Text style={{ color: colors.text, fontWeight: "600" }}>
                  ₹{totalSpent.toLocaleString()}
                </Text>
              </View>

              {/* Remaining / Over Budget Row */}
              {budget > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: colors.subtext }}>
                    {isOverBudget ? "Over Budget:" : "Remaining:"}
                  </Text>
                  <Text
                    style={{
                      color: isOverBudget ? "#FF6B6B" : "#4ECDC4",
                      fontWeight: "600",
                    }}
                  >
                    ₹{Math.abs(remaining).toLocaleString()}
                  </Text>
                </View>
              )}

              {/* Progress Bar */}
              {budget > 0 && (
                <BudgetProgressBar
                  spent={totalSpent}
                  budget={budget}
                  colors={colors}
                />
              )}
            </View>
          )}
        </View>
      </View>

      {/* ⏳ LOADING */}
      {loading && (
        <Text style={{ padding: 16, color: colors.subtext }}>
          Loading expenses...
        </Text>
      )}

      {/* 📭 EMPTY STATE */}
      {!loading && expenses.length === 0 && (
        <Text style={{ padding: 16, color: colors.subtext }}>
          No expenses yet. Add one 👇
        </Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 📋 EXPENSE LIST */}
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

          {expenses.length === 0 ? (
            <Text style={{ color: colors.subtext }}>
              No expenses yet. Add one 👇
            </Text>
          ) : (
            expenses.map((item) => (
              <View
                key={item.id}
                style={{
                  padding: 14,
                  marginBottom: 12,
                  borderRadius: 12,
                  backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
                }}
              >
                <Text style={{ color: colors.text, fontSize: 16 }}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.subtext, marginTop: 4 }}>
                  ₹{item.amount}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* 💰 SETTLEMENT HISTORY - Only show if not active */}
        {groupStatus !== "active" && (
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

            {settlementsLoading ? (
              <Text style={{ color: colors.subtext }}>
                Loading settlements...
              </Text>
            ) : recordedSettlements.length === 0 ? (
              <Text style={{ color: colors.subtext }}>
                No settlements yet.
              </Text>
            ) : (
              recordedSettlements.map((settlement) => (
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
                    {settlement.fromName || settlement.from} → {settlement.toName || settlement.to}
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
        )}
      </ScrollView>
    </View>
  );
}
