import { useTheme } from "@/src/context/themeContext";
import { updateGroupBudget } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  groupId: string;
  budget: number;
  totalSpent: number;
  userIsAdmin: boolean;
  groupStatus: string;
}

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

export default function BudgetSection({
  groupId,
  budget,
  totalSpent,
  userIsAdmin,
  groupStatus,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [budgetInput, setBudgetInput] = useState(budget > 0 ? budget.toString() : "");
  const [isEditing, setIsEditing] = useState(false);

  const remaining = budget - totalSpent;
  const isOverBudget = totalSpent > budget && budget > 0;

  const handleSave = async () => {
    if (!userIsAdmin || groupStatus !== "active") return;
    const newBudget = parseFloat(budgetInput);
    if (isNaN(newBudget) || newBudget < 0) return;
    try {
      await updateGroupBudget(groupId, newBudget);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  return (
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

      {isEditing && userIsAdmin && groupStatus === "active" ? (
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
            onPress={handleSave}
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
              setIsEditing(false);
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
                  onPress={() => setIsEditing(true)}
                  style={{ marginLeft: 8 }}
                >
                  <Text style={{ color: "#4ECDC4", fontSize: 12 }}>Edit</Text>
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
            <BudgetProgressBar spent={totalSpent} budget={budget} colors={colors} />
          )}
        </View>
      )}
    </View>
  );
}
