import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

const dummyGroups = [
  { id: '1', name: 'College Friends', members: 4 },
  { id: '2', name: 'Trip to Goa', members: 3 },
  { id: '3', name: 'Startup Team', members: 5 },
];

export default function GroupsScreen() {
  const [groups, setGroups] = useState(dummyGroups);
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>👥 Your Groups</Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.groupCard, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.groupName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.groupMembers, { color: colors.subtext }]}>{item.members} members</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={styles.createText}>Create New Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  groupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  groupName: { fontSize: 16, fontWeight: '600' },
  groupMembers: { fontSize: 13 },
  createBtn: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  createText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
