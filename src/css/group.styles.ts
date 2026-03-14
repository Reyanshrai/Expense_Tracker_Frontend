import { borderRadius, fontSize, normalize, safePadding, spacing } from '@/src/utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { 
      flex: 1,
    },
    backgroundGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    scrollContent: {
      paddingBottom: normalize(100),
    },
    header: {
      paddingHorizontal: safePadding.horizontal,
      paddingTop: safePadding.top,
      marginBottom: spacing.lg,
    },
    headerTitle: { 
      fontSize: fontSize['4xl'], 
      fontWeight: '800',
      letterSpacing: -1,
      marginBottom: spacing.xs,
    },
    headerSubtitle: {
      fontSize: fontSize.md,
      fontWeight: '500',
    },
    statsContainer: {
      paddingHorizontal: safePadding.horizontal,
      marginBottom: spacing.xl,
    },
    statsCard: {
      borderRadius: borderRadius.xl,
      shadowColor: '#667eea',
      shadowOffset: {
        width: 0,
        height: normalize(12),
      },
      shadowOpacity: 0.3,
      shadowRadius: normalize(20),
      elevation: 15,
    },
    statsContent: {
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: fontSize['2xl'],
      fontWeight: '800',
      color: '#fff',
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: fontSize.xs,
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '600',
    },
    statsDivider: {
      width: 1,
      height: normalize(40),
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginHorizontal: spacing.md,
    },
    quickActionsContainer: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      paddingHorizontal: safePadding.horizontal,
      marginBottom: spacing.base,
      letterSpacing: -0.5,
    },
    quickActionsList: {
      paddingHorizontal: spacing.md,
    },
    quickActionCard: {
      alignItems: 'center',
      padding: spacing.base,
      borderRadius: borderRadius.md,
      marginHorizontal: spacing.xs,
      width: normalize(100),
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    quickActionIcon: {
      width: normalize(40),
      height: normalize(40),
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    quickActionText: {
      fontSize: fontSize.xs,
      fontWeight: '600',
      textAlign: 'center',
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: safePadding.horizontal,
      marginBottom: spacing.lg,
      flexWrap: 'wrap',
    },
    filterTab: {
      paddingVertical: spacing.base,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      marginRight: spacing.base,
      marginBottom: spacing.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeFilterTab: {
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
    },
    filterText: {
      fontSize: fontSize.base,
      fontWeight: '600',
    },
    groupsContainer: {
      paddingHorizontal: safePadding.horizontal,
    },
    groupCardWrapper: {
      marginBottom: spacing.base,
    },
    groupCard: {
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    groupLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    groupIcon: {
      width: normalize(50),
      height: normalize(50),
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.base,
      position: 'relative',
    },
    activeIndicator: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: normalize(12),
      height: normalize(12),
      borderRadius: borderRadius.full,
      backgroundColor: '#4ECDC4',
      borderWidth: 2,
      borderColor: '#fff',
    },
    groupInfo: {
      flex: 1,
    },
    groupName: { 
      fontSize: fontSize.lg, 
      fontWeight: '700',
      marginBottom: spacing.xs,
      letterSpacing: -0.3,
    },
    groupMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    groupMembers: { 
      fontSize: fontSize.sm,
      fontWeight: '500',
    },
    separator: {
      fontSize: fontSize.sm,
      marginHorizontal: spacing.sm,
    },
    recentActivity: {
      fontSize: fontSize.sm,
      fontWeight: '500',
    },
    groupRight: {
      alignItems: 'flex-end',
    },
    totalSpent: {
      fontSize: fontSize.lg,
      fontWeight: '800',
      marginBottom: spacing.xs,
    },
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    avatarScroll: {
      paddingRight: spacing.sm,
    },
    avatar: {
      width: normalize(32),
      height: normalize(32),
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.sm,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    avatarEmoji: {
      fontSize: fontSize.base,
    },
    addMemberBtn: {
      width: normalize(32),
      height: normalize(32),
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderStyle: 'dashed',
    },
    groupActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.base,
      flex: 1,
      marginHorizontal: spacing.xs,
      justifyContent: 'center',
    },
    actionText: {
      fontSize: fontSize.xs,
      fontWeight: '600',
      marginLeft: spacing.xs,
    },
    createBtnContainer: {
      position: 'absolute',
      bottom: normalize(100), // Account for bottom tab bar (~60px) + padding
      left: safePadding.horizontal,
      right: safePadding.horizontal,
    },
    createBtn: {
      borderRadius: borderRadius.md,
      shadowColor: '#FF6B6B',
      shadowOffset: {
        width: 0,
        height: normalize(8),
      },
      shadowOpacity: 0.3,
      shadowRadius: normalize(16),
      elevation: 8,
    },
    createBtnContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: normalize(18),
      paddingHorizontal: normalize(32),
      borderRadius: borderRadius.md,
    },
    createText: { 
      color: '#fff', 
      fontWeight: '700', 
      fontSize: fontSize.md,
      marginHorizontal: spacing.sm,
    },
    createEmoji: {
      fontSize: fontSize.md,
    },
  });