import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out');
    // logic to clear session + redirect goes here
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
          style={styles.avatar}
        />
        <View>
          <Text style={[styles.name, { color: colors.text }]}>Reyansh Revansh</Text>
          <Text style={[styles.email, { color: colors.subtext }]}>reyansh@email.com</Text>
        </View>
      </View>

      <View style={[styles.optionBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.optionLabel, { color: colors.text }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={[styles.optionBox, { backgroundColor: colors.card }]} onPress={() => Alert.alert('Coming Soon')}> 
        <Text style={[styles.optionLabel, { color: colors.text }]}>Manage Groups</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.optionBox, { backgroundColor: colors.card }]} onPress={() => Alert.alert('Coming Soon')}>
        <Text style={[styles.optionLabel, { color: colors.text }]}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 30,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14 },
  optionBox: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: { fontSize: 16 },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: '#ff4d4d',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  logoutText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
