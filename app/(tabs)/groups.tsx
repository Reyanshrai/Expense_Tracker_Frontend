import AddExpenseModal from "@/src/components/groups/AddExpenseModal";
import CreateGroupModal from "@/src/components/groups/CreateGroupModal";
import GroupDetailScreen from "@/src/components/groups/GroupDetailScreen";
import GroupList from "@/src/components/groups/GroupList";
import SplitPreviewModal from "@/src/components/groups/SplitPreviewModal";
import { SkeletonList } from "@/src/components/ui/Skeleton";
import { useGroups } from "@/src/hooks/useGroups";
import { addGroupExpense } from "@/src/services/addGroupExpense";
import { calculateSettlements } from "@/src/utils/settlement";

import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useGroupsUI } from "@/src/hooks/useGroupsUI";
import { createGroup, joinGroupViaInvite } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import * as Linking from "expo-linking";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
  const [joiningGroup, setJoiningGroup] = useState(false);

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

  // 🔗 Deep Link Handling for Group Join
  useEffect(() => {
    if (!user) return;

    const handleDeepLink = async (url: string) => {
      const { path, queryParams } = Linking.parse(url);
      
      if (path === "join" && queryParams?.groupId) {
        const groupId = queryParams.groupId as string;
        
        // Check if user is already a member
        const isMember = uiGroups.some((g) => g.id === groupId);
        if (isMember) {
          Alert.alert("Already Member", "You are already a member of this group.");
          return;
        }

        setJoiningGroup(true);
        try {
          const result = await joinGroupViaInvite(
            groupId,
            user.uid,
            user.email!,
            user.displayName || "User"
          );
          Alert.alert(
            "Success!",
            `You have joined "${result.groupName}" successfully!`,
            [{ text: "OK" }]
          );
        } catch (error: any) {
          Alert.alert("Error", error.message || "Failed to join group");
        } finally {
          setJoiningGroup(false);
        }
      }
    };

    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for URL changes
    const subscription = Linking.addEventListener("url", (event) => {
      if (event.url) handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, [user, uiGroups]);

  // 🔍 Filtering logic based on group status
  const filteredGroups = useMemo(() => {
    if (selectedFilter === "all") return uiGroups;
    if (selectedFilter === "active") {
      // Show only groups with status "active"
      return uiGroups.filter((g) => (g.status || "active") === "active");
    }
    // Inactive: show groups with status "completed" or "settled"
    return uiGroups.filter((g) => {
      const status = g.status || "active";
      return status === "completed" || status === "settled";
    });
  }, [uiGroups, selectedFilter]);

  // ⏳ Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 60 }}>
        <SkeletonList count={5} />
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

      {/* 👥 GROUP LIST with Header as ListHeaderComponent */}
      <GroupList
        groups={filteredGroups}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        scaleAnim={scaleAnim}
        activeGroupCount={uiGroups.filter((g) => (g.status || "active") === "active").length}
        allGroups={uiGroups}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onSelectGroup={(group: any) => setSelectedGroup(group)}
        onAddExpense={(group: any) => setExpenseGroup(group)}
        onCreateGroup={() => setShowCreateModal(true)}
        onSplit={(group: any) => setSplitGroup(group)}
      />

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
