import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { styles } from "@/src/css/group.styles";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Animated, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GroupCard from "./GroupCard";
import GroupFilters from "./GroupFilters";
import GroupQuickActions from "./GroupQuickActions";
import GroupsListHeader from "./GroupsListHeader";
import GroupStats from "./GroupStats";

export default function GroupList({
  groups,
  fadeAnim,
  slideAnim,
  scaleAnim,
  activeGroupCount,
  allGroups,
  selectedFilter,
  setSelectedFilter,
  onSelectGroup,
  onAddExpense,
  onSplit,
  onCreateGroup,
}: any) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  // Render header components as ListHeaderComponent
  const renderHeader = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {/* 🧠 HEADER */}
      <GroupsListHeader fadeAnim={fadeAnim} slideAnim={slideAnim} />

      {/* 📈 STATS */}
      <GroupStats
        groups={allGroups.map((g: any) => ({ ...g, members: g.members }))}
        activeGroupCount={activeGroupCount}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
      />

      {/* ⚡ QUICK ACTIONS */}
      <GroupQuickActions fadeAnim={fadeAnim} slideAnim={slideAnim} />

      {/* 🧩 FILTERS */}
      <GroupFilters
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        groups={allGroups}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        colors={colors}
      />
    </Animated.View>
  );

  if (groups.length === 0) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No groups yet"
            subtitle="Create your first group to start tracking expenses"
            actionLabel="Create Group"
            onAction={onCreateGroup}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 + insets.bottom }}
      />
    );
  }

  return (
    <FlatList
      data={groups}
      extraData={groups}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <GroupCard
          group={item}
          onPress={() => onSelectGroup(item)}
          onAddExpense={onAddExpense}
          onSplit={onSplit}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
    />
  );
}
