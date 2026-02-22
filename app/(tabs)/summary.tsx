import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient"; // You'll need to install this
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { styles } from "../../src/css/summary.styles";
import { useSummary } from "@/src/hooks/useSummary";

export default function SummaryScreen() {

  const { loading, total, categories } = useSummary();
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  // Calculate percentages
  const dataWithPercentages = categories.map((item) => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(0),
  }));

  const chartData = dataWithPercentages.map((d) => ({
    name: d.name,
    population: d.amount,
    color: d.color,
    legendFontColor: colors.text,
    legendFontSize: 0, // Hide default legend
  }));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text
          style={{ color: colors.subtext, textAlign: "center", marginTop: 40 }}
        >
          Loading summary...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={[styles.greeting, { color: colors.subtext }]}>
          Your spending this month
        </Text>
        <Text style={[styles.header, { color: colors.text }]}>
          Expense Overview
        </Text>
      </View>

      {/* Total Amount Card */}
      <View
        style={[
          styles.totalCard,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
          },
        ]}
      >
        <Text style={[styles.totalLabel, { color: colors.subtext }]}>
          Total Spent
        </Text>
        <Text style={[styles.totalAmount, { color: colors.text }]}>
          ₹{total.toLocaleString()}
        </Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>This Month</Text>
        </View>
      </View>

      {/* Chart Section */}
      <View
        style={[
          styles.chartContainer,
          {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.03)"
              : "rgba(255, 255, 255, 0.8)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
          },
        ]}
      >
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 80}
          height={200}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
          hasLegend={false}
        />
      </View>

      {/* Custom Legend with Stats */}
      <View style={styles.legendContainer}>
        {dataWithPercentages.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.legendItem,
              {
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 255, 255, 0.9)",
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.legendLeft}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.legendTextContainer}>
                <Text style={[styles.legendName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.legendPercentage, { color: colors.subtext }]}
                >
                  {item.percentage}% of total
                </Text>
              </View>
            </View>
            <View style={styles.legendRight}>
              <Text style={[styles.legendAmount, { color: colors.text }]}>
                ₹{item.amount.toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.1)",
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={[styles.actionText, { color: colors.text }]}>
            View Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.1)",
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>💡</Text>
          <Text style={[styles.actionText, { color: colors.text }]}>
            Get Tips
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
