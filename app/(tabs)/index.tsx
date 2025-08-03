import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

const dummyExpenses = [
  { id: "1", title: "Pizza with friends", amount: 450, category: "Food" },
  { id: "2", title: "Uber to campus", amount: 120, category: "Transport" },
  { id: "3", title: "Netflix Split", amount: 80, category: "Entertainment" },
];

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const totalSpent = dummyExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.helloText, { color: colors.subtext }]}>Hey 👋</Text>
          <Text style={[styles.nameText, { color: colors.text }]}>Ready to track today?</Text>
        </View>
        <Image
          source={require("../../assets/images/wallet.png")}
          style={styles.avatar}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.subtext }]}>Total Spent This Week</Text>
        <Text style={[styles.amount, { color: colors.text }]}>₹{totalSpent}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Expenses</Text>

      <FlatList
        data={dummyExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.expenseCard, { backgroundColor: colors.card }]}>
            <View>
              <Text style={[styles.expenseTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.expenseCategory, { color: colors.subtext }]}>{item.category}</Text>
            </View>
            <Text style={[styles.expenseAmount, { color: colors.accent }]}>₹{item.amount}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  helloText: { fontSize: 18 },
  nameText: { fontSize: 22, fontWeight: "bold" },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  card: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 16 },
  amount: { fontSize: 32, fontWeight: "bold", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  expenseTitle: { fontSize: 16, fontWeight: "500" },
  expenseCategory: { fontSize: 12 },
  expenseAmount: { fontSize: 16, fontWeight: "bold" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    padding: 16,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
});
