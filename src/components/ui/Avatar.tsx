import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Text, View } from "react-native";

// Predefined color palette for avatars
const AVATAR_COLORS = [
  "#FF6B6B", // Red/Coral
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#A55EEA", // Purple
  "#F7B731", // Yellow
  "#FF8E53", // Orange
  "#26de81", // Green
  "#fd79a8", // Pink
  "#0984e3", // Deep Blue
  "#6c5ce7", // Violet
];

interface AvatarProps {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Get a consistent color index based on the name string
 */
const getColorIndex = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
};

/**
 * Get the first letter of a name, handling edge cases
 */
const getInitial = (name: string): string => {
  if (!name || name.trim().length === 0) return "?";
  return name.trim().charAt(0).toUpperCase();
};

export default function Avatar({
  name,
  size = 40,
  backgroundColor,
  textColor,
}: AvatarProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const initial = getInitial(name);
  const bgColor = backgroundColor || AVATAR_COLORS[getColorIndex(name)];
  const txtColor = textColor || "#fff";

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: txtColor,
          fontSize: size * 0.4,
          fontWeight: "700",
        }}
      >
        {initial}
      </Text>
    </View>
  );
}
