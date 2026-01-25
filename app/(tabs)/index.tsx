import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { styles } from "../../src/css/index.styles";
import { listenUserExpenses } from "@/src/services/expense";
import { useAuth } from "@/src/hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";
import { categoryMeta } from "@/src/utils/categoryMeta";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const colors = isDark ? darkColors : lightColors;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for FAB
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = listenUserExpenses(user.uid, (data) => {
      setExpenses(data);

      const total = data.reduce((sum: number, e: any) => sum + e.amount, 0);
      setTotalSpent(total);
    });

    return unsub;
  }, [user?.uid]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderExpenseItem = ({ item, index }: { item: any; index: number }) => {
    const key = item.category?.trim();
    const meta = categoryMeta[key] || categoryMeta["Others"];

    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            style={styles.expenseCard}
          >
            <View style={styles.expenseLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${meta.color}20` },
                ]}
              >
                <Ionicons name={meta.icon} size={24} color={meta.color} />
              </View>
              <View style={styles.expenseInfo}>
                <Text style={[styles.expenseTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <View style={styles.categoryRow}>
                  <Text
                    style={[styles.expenseCategory, { color: colors.subtext }]}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.expenseRight}>
              <Text style={[styles.expenseAmount, { color: meta.color }]}>
                ₹{item.amount}
              </Text>
              <Feather name="chevron-right" size={16} color={colors.subtext} />
            </View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <BlurView
        intensity={15}
        tint={isDark ? "dark" : "light"}
        style={styles.categoryCard}
      >
        <View
          style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}
        >
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {item.category}
        </Text>
        <Text style={[styles.categoryAmount, { color: item.color }]}>
          ₹{item.amount}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: item.color,
                width: `${item.percentage}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.categoryPercent, { color: colors.subtext }]}>
          {item.percentage}%
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? [
                "rgba(102, 126, 234, 0.1)",
                "rgba(118, 75, 162, 0.05)",
                "transparent",
              ]
            : [
                "rgba(102, 126, 234, 0.05)",
                "rgba(118, 75, 162, 0.03)",
                "transparent",
              ]
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={[styles.helloText, { color: colors.subtext }]}>
              Hey there! 👋
            </Text>
            <Text style={[styles.nameText, { color: colors.text }]}>
              Ready to track today?
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <BlurView
              intensity={20}
              tint={isDark ? "dark" : "light"}
              style={styles.avatarContainer}
            >
              <Image
                source={require("../../assets/images/wallet.png")}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Balance Card */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={["#667eea", "#764ba2", "#f093fb"]}
              style={styles.balanceCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <BlurView
                intensity={10}
                tint="light"
                style={styles.balanceContent}
              >
                <View style={styles.balanceHeader}>
                  <Text style={styles.cardTitle}>Total Spent This Week 📊</Text>
                  <MaterialIcons
                    name="trending-up"
                    size={24}
                    color="rgba(255,255,255,0.8)"
                  />
                </View>
                <Text style={styles.amount}>₹{totalSpent}</Text>
                <View style={styles.balanceFooter}>
                  {/* <View style={styles.changeIndicator}>
                    <Feather name="arrow-up-right" size={16} color="#4ECDC4" />
                    <Text style={styles.changeText}>+12% from last week</Text>
                  </View>
                  <TouchableOpacity style={styles.viewDetailsBtn}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Feather
                      name="arrow-right"
                      size={14}
                      color="rgba(255,255,255,0.8)"
                    />
                  </TouchableOpacity> */}
                </View>
              </BlurView>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View
          style={[
            styles.quickStatsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Spending by Category 📈
          </Text>
          {/* <FlatList
            data={categoryStats}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.category}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          /> */}
        </Animated.View>

        {/* Recent Expenses */}
        <Animated.View
          style={[
            styles.expensesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Activity 🕒
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [{ rotate: spin }, { scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E53", "#FF6B9D"]}
            style={styles.fab}
          >
            <BlurView intensity={10} tint="light" style={styles.fabContent}>
              <Ionicons name="add" size={28} color="#fff" />
            </BlurView>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
