import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { styles } from '../../src/css/expense.styles';

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const handleAdd = () => {
    if (!title || !amount || !category) {
      Alert.alert('Please fill all fields');
      return;
    }

    console.log({ title, amount, category });
    Alert.alert('Success', 'Expense Added');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>➕ Add New Expense</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Expense Title"
        placeholderTextColor={colors.subtext}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Amount (₹)"
        placeholderTextColor={colors.subtext}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Category (Food, Travel, etc.)"
        placeholderTextColor={colors.subtext}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleAdd}>
        <Ionicons name="checkmark-circle" size={22} color="#fff" />
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

