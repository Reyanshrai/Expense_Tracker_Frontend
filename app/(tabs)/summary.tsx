import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

const data = [
  { name: 'Food', amount: 450, color: '#FF6384', legendFontColor: '#333', legendFontSize: 14 },
  { name: 'Travel', amount: 120, color: '#36A2EB', legendFontColor: '#333', legendFontSize: 14 },
  { name: 'Entertainment', amount: 80, color: '#FFCE56', legendFontColor: '#333', legendFontSize: 14 },
];

export default function SummaryScreen() {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>📊 Expense Summary</Text>
      <Text style={[styles.totalText, { color: colors.subtext }]}>Total: ₹{total}</Text>

      <PieChart
        data={data.map(d => ({
          name: d.name,
          population: d.amount,
          color: d.color,
          legendFontColor: colors.text,
          legendFontSize: d.legendFontSize,
        }))}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.background,
          backgroundGradientTo: colors.background,
          color: (opacity = 1) => colors.text,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  totalText: { fontSize: 18, marginBottom: 20 },
});
