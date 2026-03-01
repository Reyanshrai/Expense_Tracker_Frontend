import { Animated, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { styles } from "@/src/css/group.styles";

type Props = {
  group: any;
  onPress: () => void;
  onAddExpense?: (group: any) => void;
  onSplit: (group: any) => void;
};



export default function GroupCard({ group, onPress, onAddExpense, onSplit }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;


  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.groupCardWrapper}
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
                <Text
                  style={[styles.groupMembers, { color: colors.subtext }]}
                >
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
            <Text style={[styles.totalSpent, { color: group.color }]}>
              ₹{group.totalSpent}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.subtext} />
          </View>
        </View>

        {/* 🔹 AVATARS */}
        <View style={styles.avatarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarScroll}
          >
            {(group.avatars || []).map((avatar: string, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.avatar,
                  { backgroundColor: `${group.color}15` },
                ]}
              >
                <Text style={styles.avatarEmoji}>{avatar}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.addMemberBtn}>
            <Ionicons name="add" size={16} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        {/* 🔹 ACTIONS */}
        <View style={styles.groupActions}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: `${group.color}15` },
            ]}
            onPress={()=> onSplit(group)}
          >
            <Ionicons name="receipt" size={16} color={group.color} />
            <Text style={[styles.actionText, { color: group.color }]}>
              Split
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: `${group.color}15` },
            ]}
            onPress={()=> onAddExpense?.(group)}
          >
            <Ionicons name="add-circle" size={16} color={group.color} />
            <Text style={[styles.actionText, { color: group.color }]}>
              Add
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: `${group.color}15` },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={group.color}
            />
            <Text style={[styles.actionText, { color: group.color }]}>
              Settle
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}