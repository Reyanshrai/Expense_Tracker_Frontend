import { Animated, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "@/src/css/group.styles";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

export default function GroupFilters({
  selectedFilter,
  setSelectedFilter,
  groups,
  fadeAnim,
  slideAnim,
  colors,
}: any) {
  return (
    <Animated.View
      style={[
        styles.filterContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {FILTERS.map((item) => (
        <TouchableOpacity
          key={item.key}
          onPress={() => {
            setSelectedFilter(item.key);
          }}
          activeOpacity={0.8}
        >
          <BlurView
            intensity={selectedFilter === item.key ? 20 : 10}
            tint="light"
            style={[
              styles.filterTab,
              selectedFilter === item.key && styles.activeFilterTab,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: selectedFilter === item.key ? "#667eea" : colors.subtext,
                },
              ]}
            >
              {item.label}
            </Text>
          </BlurView>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}
