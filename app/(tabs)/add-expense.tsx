import React, { useState } from 'react';
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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { styles } from '../../src/css/expense.styles';

const categories = [
  { name: 'Food', icon: '🍕', color: '#FF6B8A' },
  { name: 'Travel', icon: '✈️', color: '#4ECDC4' },
  { name: 'Entertainment', icon: '🎬', color: '#FFE66D' },
  { name: 'Shopping', icon: '🛍️', color: '#A8E6CF' },
  { name: 'Health', icon: '🏥', color: '#FF8B94' },
  { name: 'Bills', icon: '📋', color: '#B4A7D6' },
  { name: 'Education', icon: '📚', color: '#85C1E9' },
  { name: 'Other', icon: '📝', color: '#F8C471' },
];

export default function AddExpenseScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const router = useRouter();

  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const handleAdd = () => {
    if (!title || !amount || !selectedCategory) {
      Alert.alert('Oops! 😅', 'Please fill all fields to continue', [
        { text: 'Got it!', style: 'default' }
      ]);
      return;
    }

    console.log({ title, amount, category: selectedCategory });
    Alert.alert('Success! 🎉', 'Your expense has been added', [
      { text: 'Awesome!', onPress: () => router.back() }
    ]);
  };

  const getInputStyle = (inputName: string) => [
    styles.input,
    {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: focusedInput === inputName 
        ? (isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)')
        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
      color: colors.text,
      borderWidth: focusedInput === inputName ? 2 : 1,
      transform: [{ scale: focusedInput === inputName ? 1.02 : 1 }],
    }
  ];

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              }
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
              style={getInputStyle('title')}
              placeholder="e.g., Lunch at cafe, Uber ride, Movie tickets"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput('')}
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              💰 How much did it cost?
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.text }]}>₹</Text>
              <TextInput
                style={[
                  getInputStyle('amount'),
                  { paddingLeft: 45, fontSize: 24, fontWeight: '700' }
                ]}
                placeholder="0"
                placeholderTextColor={colors.subtext}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                onFocus={() => setFocusedInput('amount')}
                onBlur={() => setFocusedInput('')}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              📂 Choose a category
            </Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: selectedCategory === cat.name 
                        ? cat.color + '20'
                        : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)'),
                      borderColor: selectedCategory === cat.name 
                        ? cat.color 
                        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                      borderWidth: selectedCategory === cat.name ? 2 : 1,
                      transform: [{ scale: selectedCategory === cat.name ? 1.05 : 1 }],
                    }
                  ]}
                  onPress={() => setSelectedCategory(cat.name)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[
                    styles.categoryName, 
                    { 
                      color: selectedCategory === cat.name ? cat.color : colors.text,
                      fontWeight: selectedCategory === cat.name ? '700' : '500'
                    }
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Add Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.addButton,
              {
                backgroundColor: (!title || !amount || !selectedCategory) 
                  ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
                  : colors.primary,
                opacity: (!title || !amount || !selectedCategory) ? 0.6 : 1,
              }
            ]} 
            onPress={handleAdd}
            activeOpacity={0.8}
            disabled={!title || !amount || !selectedCategory}
          >
            <View style={styles.buttonContent}>
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={(!title || !amount || !selectedCategory) ? colors.subtext : '#fff'} 
              />
              <Text style={[
                styles.buttonText,
                { 
                  color: (!title || !amount || !selectedCategory) ? colors.subtext : '#fff'
                }
              ]}>
                Add Expense
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Tips */}
        <View style={[
          styles.tipsContainer,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
          }
        ]}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Quick Tip</Text>
          <Text style={[styles.tipsText, { color: colors.subtext }]}>
            Be specific with your expense titles to track your spending patterns better!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

