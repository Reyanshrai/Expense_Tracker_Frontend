import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    input: {
      padding: 14,
      borderRadius: 10,
      marginBottom: 16,
      fontSize: 16,
    },
    button: {
      padding: 14,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  });