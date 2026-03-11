import CreateGroupModal from "@/src/components/groups/CreateGroupModal";
import Avatar from "@/src/components/ui/Avatar";
import { useTheme } from "@/src/context/themeContext";
import { styles } from "@/src/css/group.styles";
import { addMembersToGroup } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#4ECDC4", text: "#fff" },
  completed: { bg: "#FF8E53", text: "#fff" },
  settled: { bg: "#9CA3AF", text: "#fff" },
};

type Props = {
  group: any;
  onPress: () => void;
  onAddExpense?: (group: any) => void;
  onSplit: (group: any) => void;
};

export default function GroupCard({
  group,
  onPress,
  onAddExpense,
  onSplit,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.groupCardWrapper}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
      >
        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          style={styles.groupCard}
        >
          {/* 🔹 HEADER */}
          <View style={styles.groupHeader}>
            <View style={styles.groupLeft}>
              <View
                style={[
                  styles.groupIcon,
                  { backgroundColor: `${group.color}20` },
                ]}
              >
                <Ionicons
                  name={group.icon || "people"}
                  size={24}
                  color={group.color}
                />
              </View>

              <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: colors.text }]}>
                  {group.name}
                </Text>

                <View style={styles.groupMeta}>
                  <Text style={[styles.groupMembers, { color: colors.subtext }]}>
                    {group.participants.length} members
                  </Text>

                  <Text style={[styles.separator, { color: colors.subtext }]}>
                    •
                  </Text>

                  <Text
                    style={[styles.recentActivity, { color: colors.subtext }]}
                  >
                    {group.recentActivity ?? "Just now"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.groupRight}>
              {/* Status Badge */}
              <View
                style={{
                  backgroundColor: statusColors[group.status || "active"].bg,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color: statusColors[group.status || "active"].text,
                    fontSize: 10,
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {group.status || "active"}
                </Text>
              </View>
              <Text style={[styles.totalSpent, { color: group.color }]}>
                ₹{group.totalSpent}
              </Text>
              <Feather name="chevron-right" size={20} color={colors.subtext} />
            </View>
          </View>

          {/* 🔹 AVATARS - Using Initial Avatar Component */}
          <View style={styles.avatarContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.avatarScroll}
            >
              {(group.participants || []).slice(0, 5).map((participant: any, idx: number) => (
                <View
                  key={idx}
                  style={{ marginRight: -8 }}
                >
                  <Avatar
                    name={participant.name || participant.email || `User ${idx + 1}`}
                    size={36}
                  />
                </View>
              ))}
              {(group.participants || []).length > 5 && (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: `${group.color}30`,
                      marginLeft: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text style={{ color: group.color, fontSize: 12, fontWeight: "700" }}>
                    +{(group.participants || []).length - 5}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.addMemberBtn}
              onPress={(e) => {
                e.stopPropagation();
                setModalVisible(true);
              }}
            >
              <Ionicons name="add" size={16} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          {/* 🔹 ACTIONS */}
          <View style={styles.groupActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: `${group.color}15` }]}
              onPress={(e) => {
                e.stopPropagation();
                onSplit(group);
              }}
            >
              <Ionicons name="receipt" size={16} color={group.color} />
              <Text style={[styles.actionText, { color: group.color }]}>
                Split
              </Text>
            </TouchableOpacity>

            {/* Add Expense - Only show if group is active */}
            {(group.status || "active") === "active" && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: `${group.color}15` }]}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddExpense?.(group);
                }}
              >
                <Ionicons name="add-circle" size={16} color={group.color} />
                <Text style={[styles.actionText, { color: group.color }]}>Add</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: `${group.color}15` }]}
              onPress={(e) => e.stopPropagation()}
            >
              <Ionicons name="checkmark-circle" size={16} color={group.color} />
              <Text style={[styles.actionText, { color: group.color }]}>
                Settle
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
      <CreateGroupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={async (_, members) => {
          if (members.length > 0) {
            await addMembersToGroup(group.id, members);
          }
          setModalVisible(false);
        }}
        mode="addMember"
        groupName={group.name}
      />
    </View>
  );
}
