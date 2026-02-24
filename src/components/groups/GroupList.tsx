import { Animated, FlatList } from "react-native";
import GroupCard from "./GroupCard";
import { styles } from "@/src/css/group.styles";

export default function GroupList({
  groups,
  fadeAnim,
  slideAnim,
  onSelectGroup,
  onAddExpense,
}: any) {
  return (
    <Animated.View
      style={[
        styles.groupsContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <FlatList
        data={groups}
        extraData={groups} // ⭐ THIS IS THE FIX
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={() => onSelectGroup(item)} 
           onAddExpense={onAddExpense}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}
