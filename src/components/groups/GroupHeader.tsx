import { useTheme } from "@/src/context/themeContext";
import { updateGroupStatus } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Share, Text, TouchableOpacity, View } from "react-native";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#4ECDC4", text: "#fff" },
  completed: { bg: "#FF8E53", text: "#fff" },
  settled: { bg: "#9CA3AF", text: "#fff" },
};

interface Props {
  group: {
    id: string;
    name: string;
    status?: string;
  };
  totalSpent: number;
  userIsAdmin: boolean;
  onBack: () => void;
}

function generateInviteLink(groupId: string): string {
  return `expensetrackerfrontend://join?groupId=${groupId}`;
}

export default function GroupHeader({ group, totalSpent, userIsAdmin, onBack }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  
  // Safety check for group
  if (!group) {
    return (
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text, marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }
  
  const groupStatus = group.status || "active";

  const handleCompleteTrip = async () => {
    if (!userIsAdmin) return;
    try {
      await updateGroupStatus(group.id, "completed");
    } catch (error) {
      console.error("Error completing trip:", error);
    }
  };

  const handleShareInvite = async () => {
    const link = generateInviteLink(group.id);
    try {
      await Share.share({
        message: `Join my group "${group.name}" on Expense Tracker!\n\n${link}`,
        title: "Invite to Group",
      });
    } catch (error) {
      console.error("Error sharing invite:", error);
    }
  };

  return (
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
        Total Spent: ₹{totalSpent.toLocaleString()}
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

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        {/* Invite Link Button */}
        <TouchableOpacity
          onPress={handleShareInvite}
          style={{
            backgroundColor: "#4ECDC4",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 10,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Invite Link
          </Text>
        </TouchableOpacity>

        {/* Complete Trip Button (Admin Only) */}
        {userIsAdmin && groupStatus === "active" && (
          <TouchableOpacity
            onPress={handleCompleteTrip}
            style={{
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
      </View>
    </View>
  );
}
