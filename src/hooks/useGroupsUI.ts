import { useGroups } from "@/src/hooks/useGroups";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7B731"];
const ICONS = ["school", "airplane", "bulb", "restaurant"];
const AVATARS = ["👨‍🎓", "👩‍🎓", "👨‍💻", "👩‍🎨", "🚀", "🍕"];

export function useGroupsUI() {
  const { groups, loading } = useGroups();

  const uiGroups = groups.map((group, index) => ({
    id: group.id,
    name: group.name,
    members: group.members.length,
    totalSpent: 0,              // 🔥 later from group expenses
    recentActivity: "Just now",  // 🔥 later real timestamp
    color: COLORS[index % COLORS.length],
    icon: ICONS[index % ICONS.length],
    avatars: AVATARS.slice(0, Math.min(group.members.length, 5)),
    isActive: true,
  }));

  return { groups: uiGroups, loading };
}