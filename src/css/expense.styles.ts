import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
      marginTop: 10,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    headerTextContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: 16,
      opacity: 0.8,
      marginBottom: 4,
      fontWeight: '500',
    },
    header: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    formContainer: {
      gap: 24,
      marginBottom: 32,
    },
    inputContainer: {
      gap: 12,
    },
    inputLabel: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    input: {
      borderRadius: 16,
      padding: 18,
      fontSize: 16,
      fontWeight: '500',
      borderWidth: 1,
    },
    amountInputContainer: {
      position: 'relative',
    },
    currencySymbol: {
      position: 'absolute',
      left: 18,
      top: '50%',
      transform: [{ translateY: -12 }],
      fontSize: 24,
      fontWeight: '700',
      zIndex: 1,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryCard: {
      width: '22%',
      aspectRatio: 1,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      gap: 8,
    },
    categoryIcon: {
      fontSize: 24,
    },
    categoryName: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
    buttonContainer: {
      marginBottom: 20,
    },
    addButton: {
      borderRadius: 20,
      padding: 18,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '700',
    },
    tipsContainer: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    tipsText: {
      fontSize: 14,
      lineHeight: 20,
      opacity: 0.8,
    },
  });