import { useGroups } from "@/src/hooks/useGroups";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7B731"];
const ICONS = ["school", "airplane", "bulb", "restaurant"];
const AVATARS = ["👨‍🎓", "👩‍🎓", "👨‍💻", "👩‍🎨", "🚀", "🍕"];

export function useGroupsUI() {
  const { groups, loading } = useGroups();

  const uiGroups = groups.map((group, index) => {
    return {
      id: group.id,
      name: group.name,

      participantsCount: group.participants?.length ?? 0,

      totalSpent: Number(group.totalSpent ?? 0),
      recentActivity: "Just now",

      color: COLORS[index % COLORS.length],
      icon: ICONS[index % ICONS.length],

      // ✅ avatars based on total members
      avatars: AVATARS.slice(0, Math.min(group.participants?.length ?? 1, 5)),

      isActive: Number(group.totalSpent ?? 0) > 0,
    };
  });

  return { groups: uiGroups, loading };
}
