import { useTheme } from "@/src/context/themeContext";
import { updateGroupStatus } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

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
    participants?: any[];
  };
  totalSpent: number;
  userIsAdmin: boolean;
  onBack: () => void;
}

export default function GroupHeader({ group, totalSpent, userIsAdmin, onBack }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  
  if (!group) {
    return (
      <View style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: colors.primary }}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const groupStatus = group.status || "active";
  const memberCount = group.participants?.length || 0;

  const handleCompleteTrip = async () => {
    if (!userIsAdmin) return;
    try {
      await updateGroupStatus(group.id, "completed");
    } catch (error) {
      console.error("Error completing trip:", error);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={{ color: colors.primary, marginLeft: 4, padding: 15, fontSize: 14 }}>Back</Text>
        </View>
      </TouchableOpacity>

      {/* Group Name */}
      <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
        {group.name}
      </Text>

      {/* Members & Status Row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 12 }}>
        {/* Members */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="people" size={14} color={colors.subtext} />
          <Text style={{ color: colors.subtext, fontSize: 13, marginLeft: 4 }}>
            {memberCount} members
          </Text>
        </View>

        {/* Status Badge */}
        <View
          style={{
            backgroundColor: statusColors[groupStatus].bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: statusColors[groupStatus].text,
              fontSize: 11,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {groupStatus}
          </Text>
        </View>

        {/* Complete Trip Button (Admin Only) */}
        {userIsAdmin && groupStatus === "active" && (
          <TouchableOpacity
            onPress={handleCompleteTrip}
            style={{
              backgroundColor: "#FF8E53",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              marginLeft: "auto",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 11 }}>
              Complete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
