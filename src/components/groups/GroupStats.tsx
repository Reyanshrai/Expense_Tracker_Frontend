import { styles } from "@/src/css/group.styles";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, Text, View } from "react-native";

type Group = {
  id: string;
  name: string;
  members: number;
  totalSpent: number;
};

type Props = {
  groups: Group[];
  activeGroupCount: number;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
};  

export default function GroupStats({
  groups,
  activeGroupCount,
  fadeAnim,
  scaleAnim,
}: Props) {
  return (

    <Animated.View
      style={[
        styles.statsContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={styles.statsCard}
      >
        <BlurView intensity={10} tint="light" style={styles.statsContent}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeGroupCount}</Text>
              <Text style={styles.statLabel}>Active Groups</Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ₹{groups.reduce((s, g) => s + g.totalSpent, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {groups.reduce((s, g) => s + g.members, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Members</Text>
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </Animated.View>
  );
}