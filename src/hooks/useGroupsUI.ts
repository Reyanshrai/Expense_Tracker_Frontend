import { useGroups } from "@/src/hooks/useGroups";
import { Group } from "@/src/types/group";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7B731"];
const ICONS = ["school", "airplane", "bulb", "restaurant"];
const AVATARS = ["👨‍🎓", "👩‍🎓", "👨‍💻", "👩‍🎨", "🚀", "🍕"];

export function useGroupsUI() {
  const { groups, loading } = useGroups();

  const uiGroups = groups.map((group : Group, index) => ({
    id: group.id,
    name: group.name,
    members: group.participants.length,
    totalSpent: Number(group.totalSpent ?? 0),
    recentActivity: "Just now",
    color: COLORS[index % COLORS.length],
    icon: ICONS[index % ICONS.length],
    avatars: AVATARS.slice(0, Math.min(group.participants.length, 5)),
    isActive: Number(group.totalSpent ?? 0) > 0,
    participants: group.participants, // 🔥 pass full data
  }));

  return { groups: uiGroups, loading };
}
