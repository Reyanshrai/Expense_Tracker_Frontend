import CreateGroupModal from "@/src/components/groups/CreateGroupModal";
import GroupHeader from "@/src/components/groups/GroupHeader";
import GroupStats from "@/src/components/groups/GroupStats";
import GroupQuickActions from "@/src/components/groups/GroupQuickActions";
import GroupFilters from "@/src/components/groups/GroupFilters";
import GroupList from "@/src/components/groups/GroupList";
import GroupDetailScreen from "@/src/components/groups/GroupDetailScreen";

import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { useGroupsUI } from "@/src/hooks/useGroupsUI";
import { createGroup } from "@/src/services/group";
import { darkColors, lightColors } from "@/src/utils/themeColors";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { useContext, useEffect, useRef, useState, useMemo } from "react";
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
  const { groups, loading } = useGroupsUI();
  

  // 🎛 State
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

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
    if (selectedFilter === "all") return groups;
    if (selectedFilter === "active") {
      return groups.filter((g) => g.totalSpent > 0);
    }
    return groups.filter((g) => g.totalSpent === 0);
  }, [groups, selectedFilter]); 

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
        <GroupStats groups={groups} fadeAnim={fadeAnim} scaleAnim={scaleAnim} />

        {/* ⚡ QUICK ACTIONS */}
        <GroupQuickActions fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* 🧩 FILTERS */}
        <GroupFilters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          groups={groups}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          colors={colors}
        />

        {/* 👥 GROUP LIST */}
        <GroupList
          groups={filteredGroups}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          // onSelectGroup={(group: any) => setSelectedGroup(group)}
        />
      </ScrollView>

      {/* ➕ CREATE GROUP MODAL */}
      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(name, members) => {
          if (!user) return;
          createGroup(user, name, members);
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
    </View>
  );
}
