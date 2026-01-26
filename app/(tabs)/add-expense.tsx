import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { styles } from "../../src/css/expense.styles";
import { addExpense } from "@/src/services/expense";
import { auth } from "@/src/services/firebase";
import { categoryMeta } from "@/src/utils/categoryMeta";
import { Picker } from "@react-native-picker/picker";

export default function AddExpenseScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusedInput, setFocusedInput] = useState("");
  const router = useRouter();

  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const categories = Object.keys(categoryMeta).map((key) => ({
    name: key,
    ...categoryMeta[key],
  }));

  const handleAdd = async () => {
    if (!title || !amount || !selectedCategory) {
      Alert.alert("Oops! 😅", "Please fill all fields to continue", [
        { text: "Got it!", style: "default" },
      ]);
      return;
    }

    try {
      await addExpense(auth.currentUser!, {
        title,
        amount: Number(amount),
        category: selectedCategory,
      });

      setTitle("");
      setAmount("");
      setSelectedCategory("");

      Alert.alert("Expense Added ✅","Your expense has been saved!",[
        {
          text: "OK",
           onPress: () => router.back(),
        }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const getInputStyle = (inputName: string) => [
    styles.input,
    {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(255, 255, 255, 0.9)",
      borderColor:
        focusedInput === inputName
          ? isDark
            ? "rgba(255, 255, 255, 0.3)"
            : "rgba(0, 0, 0, 0.2)"
          : isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
      color: colors.text,
      borderWidth: focusedInput === inputName ? 2 : 1,
      transform: [{ scale: focusedInput === inputName ? 1.02 : 1 }],
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.greeting, { color: colors.subtext }]}>
              Track your spending
            </Text>
            <Text style={[styles.header, { color: colors.text }]}>
              Add Expense
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              💡 What did you spend on?
            </Text>
            <TextInput
              style={getInputStyle("title")}
              placeholder="e.g., Lunch at cafe, Uber ride, Movie tickets"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setFocusedInput("title")}
              onBlur={() => setFocusedInput("")}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              💰 How much did it cost?
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>
                ₹
              </Text>
              <TextInput
                style={[
                  getInputStyle("amount"),
                  { paddingLeft: 45, fontSize: 24, fontWeight: "700" },
                ]}
                placeholder="0"
                placeholderTextColor={colors.subtext}
                value={amount}
                keyboardType="numeric"
                onFocus={() => setFocusedInput("amount")}
                onBlur={() => setFocusedInput("")}
                onChangeText={(text) =>{
                  // Allow only numbers and decimal points
                  const numericText = text.replace(/[^0-9.]/g, "");
                  setAmount(numericText);
                }}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              📂 Choose a category
            </Text>
            <View
              style={[
                styles.input,
                {
                  padding: 0,
                  overflow: "hidden",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.9)",
                },
              ]}
            >
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
                dropdownIconColor={colors.text}
                style={{ color: colors.background }}
              >
                <Picker.Item label="Select category..." value="" />
                {categories.map((cat) => (
                  <Picker.Item
                    key={cat.name}
                    label={cat.name}
                    value={cat.name}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Add Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor:
                  !title || !amount || !selectedCategory
                    ? isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)"
                    : colors.primary,
                opacity: !title || !amount || !selectedCategory ? 0.6 : 1,
              },
            ]}
            onPress={handleAdd}
            activeOpacity={0.8}
            disabled={!title || !amount || !selectedCategory}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="add-circle"
                size={24}
                color={
                  !title || !amount || !selectedCategory
                    ? colors.subtext
                    : "#fff"
                }
              />
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      !title || !amount || !selectedCategory
                        ? colors.subtext
                        : "#fff",
                  },
                ]}
              >
                Add Expense
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
