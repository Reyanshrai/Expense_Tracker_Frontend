import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTheme } from "@/src/context/themeContext";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { styles } from "@/src/css/group.styles";

const quickActions = [
  { id: "1", title: "Split Bill", icon: "receipt", color: "#FF6B6B" },
  { id: "2", title: "Add Expense", icon: "add-circle", color: "#4ECDC4" },
  { id: "3", title: "Settle Up", icon: "checkmark-circle", color: "#45B7D1" },
  { id: "4", title: "View Stats", icon: "stats-chart", color: "#A55EEA" },
];

type Props = {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
};

export default function GroupQuickActions({ fadeAnim, slideAnim }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <BlurView
        intensity={15}
        tint={isDark ? "dark" : "light"}
        style={styles.quickActionCard}
      >
        <View
          style={[
            styles.quickActionIcon,
            { backgroundColor: `${item.color}20` },
          ]}
        >
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>

        <Text style={[styles.quickActionText, { color: colors.text }]}>
          {item.title}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={[
        styles.quickActionsContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Quick Actions ⚡
      </Text>

      <FlatList
        data={quickActions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsList}
      />
    </Animated.View>
  );
}