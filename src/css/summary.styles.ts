import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    headerContainer: {
      marginBottom: 24,
      marginTop: 10,
    },
    greeting: {
      fontSize: 16,
      opacity: 0.8,
      marginBottom: 4,
      fontWeight: '500',
    },
    header: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    totalCard: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      opacity: 0.8,
    },
    totalAmount: {
      fontSize: 36,
      fontWeight: '800',
      marginBottom: 12,
      letterSpacing: -1,
    },
    totalBadge: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: 'rgba(76, 175, 80, 0.15)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    totalBadgeText: {
      color: '#4CAF50',
      fontSize: 12,
      fontWeight: '600',
    },
    chartContainer: {
      borderRadius: 24,
      padding: 20,
      marginBottom: 20,
      alignItems: 'center',
      borderWidth: 1,
    },
    legendContainer: {
      gap: 12,
      marginBottom: 24,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    legendLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    colorDot: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconText: {
      fontSize: 18,
    },
    legendTextContainer: {
      flex: 1,
    },
    legendName: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 2,
    },
    legendPercentage: {
      fontSize: 14,
      opacity: 0.7,
      fontWeight: '500',
    },
    legendRight: {
      alignItems: 'flex-end',
    },
    legendAmount: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      gap: 8,
    },
    actionIcon: {
      fontSize: 20,
    },
    actionText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });