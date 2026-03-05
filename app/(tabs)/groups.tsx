import AddExpenseModal from "@/src/components/groups/AddExpenseModal";
import CreateGroupModal from "@/src/components/groups/CreateGroupModal";
import GroupDetailScreen from "@/src/components/groups/GroupDetailScreen";
import GroupFilters from "@/src/components/groups/GroupFilters";
import GroupHeader from "@/src/components/groups/GroupHeader";
import GroupList from "@/src/components/groups/GroupList";
import GroupQuickActions from "@/src/components/groups/GroupQuickActions";
import GroupStats from "@/src/components/groups/GroupStats";
import SplitPreviewModal from "@/src/components/groups/SplitPreviewModal";
import { useGroups } from "@/src/hooks/useGroups";
import { addGroupExpense } from "@/src/services/addGroupExpense";
import { calculateSettlements } from "@/src/utils/settlement";

import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useGroupsUI } from "@/src/hooks/useGroupsUI";
import { createGroup } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { styles } from "@/src/css/group.styles";

const { width } = Dimensions.get("window");

export default function GroupsScreen() {
  // 🔐 Auth
  const { user } = useContext(authContext);

  // 📊 Data

  const { groups: rawGroups } = useGroups();
  const { groups: uiGroups, loading } = useGroupsUI();

  // 🎛 State
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [expenseGroup, setExpenseGroup] = useState<any | null>(null);
  const [splitGroup, setSplitGroup] = useState<any | null>(null);
  const [settlements, setSettlements] = useState<any[]>([]);

  // 🎨 Theme
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  // 🎞 Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 🔍 Filtering logic
  const filteredGroups = useMemo(() => {
    if (selectedFilter === "all") return uiGroups;
    if (selectedFilter === "active") {
      return uiGroups.filter((g) => g.totalSpent > 0);
    }
    return uiGroups.filter((g) => g.totalSpent === 0);
  }, [uiGroups, selectedFilter]);

  // ⏳ Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>Loading groups...</Text>
      </View>
    );
  }

  // 📄 Group Detail View
  if (selectedGroup) {
    return (
      <GroupDetailScreen
        group={selectedGroup}
        onBack={() => setSelectedGroup(null)}
      />
    );
  }

  const handleSplit = (group: any) => {
    if (!group?.balances) {
      console.warn("No balances found for group");
      return;
    }

    const result = calculateSettlements(group.balances);

    setSettlements(result);
    setSplitGroup(group);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* 🌈 Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? [
                "rgba(102, 126, 234, 0.1)",
                "rgba(118, 75, 162, 0.05)",
                "transparent",
              ]
            : [
                "rgba(102, 126, 234, 0.05)",
                "rgba(118, 75, 162, 0.03)",
                "transparent",
              ]
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 🧠 HEADER */}
        <GroupHeader fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* 📈 STATS */}
        <GroupStats
          groups={uiGroups.map((g) => ({ ...g, members: g.members }))}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
        />

        {/* ⚡ QUICK ACTIONS */}
        <GroupQuickActions fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* 🧩 FILTERS */}
        <GroupFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          groups={uiGroups}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          colors={colors}
        />

        {/* 👥 GROUP LIST */}
        <GroupList
          groups={filteredGroups}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          onSelectGroup={(group: any) => setSelectedGroup(group)}
          onAddExpense={(group: any) => setExpenseGroup(group)}
          onSplit={(group: any) => setSplitGroup(group)}
        />
      </ScrollView>

      {/* ➕ CREATE GROUP MODAL */}
      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(name, members) => {
          if (!user) return;
          createGroup(user, name, members);
          setShowCreateModal(false);
        }}
      />

      {/* 🚀 FLOATING CREATE BUTTON */}
      <Animated.View
        style={[
          styles.createBtnContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowCreateModal(true)}
        >
          <LinearGradient
            colors={["#FF6B6B", "#FF8E53", "#FF6B9D"]}
            style={styles.createBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <BlurView
              intensity={10}
              tint="light"
              style={styles.createBtnContent}
            >
              <Text style={styles.createText}>Create New Group 🚀</Text>
            </BlurView>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <AddExpenseModal
        visible={!!expenseGroup}
        onClose={() => setExpenseGroup(null)}
        onSave={async (title, amount) => {
          if (!user || !expenseGroup) return;

          const realGroup = rawGroups.find((g) => g.id === expenseGroup.id);

          if (!realGroup) {
            console.error("Group not found for expense:", expenseGroup.id);
            return;
          }

          // Prevent adding expense if group is not active
          if ((realGroup.status || "active") !== "active") {
            console.error("Cannot add expense: Group is not active");
            return;
          }

          await addGroupExpense(
            user,
            {
              id: expenseGroup.id,
              participants: expenseGroup.participants,
            },
            title,
            amount,
          );
          setExpenseGroup(null);
        }}
      />

      <SplitPreviewModal
        visible={!!splitGroup}
        group={splitGroup}
        onClose={() => {
          setSplitGroup(null);
          setSettlements([]);
        }}
      />
    </View>
  );
}
