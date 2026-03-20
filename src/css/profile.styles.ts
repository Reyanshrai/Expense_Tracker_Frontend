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
    headerContainer: {
      paddingHorizontal: safePadding.horizontal,
      paddingTop: safePadding.top,
      marginBottom: spacing.xl,
    },
    profileCard: {
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
    profileContent: {
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      marginRight: spacing.md,
    },
    avatar: { 
      width: normalize(80), 
      height: normalize(80), 
      borderRadius: borderRadius.full,
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: normalize(5),
      right: normalize(5),
      width: normalize(20),
      height: normalize(20),
      borderRadius: borderRadius.full,
      backgroundColor: '#4ECDC4',
      borderWidth: 3,
      borderColor: '#fff',
    },
    editAvatarBtn: {
      position: 'absolute',
      top: -normalize(5),
      right: -normalize(5),
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: borderRadius.full,
      width: normalize(30),
      height: normalize(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInfo: {
      flex: 1,
    },
    name: { 
      fontSize: fontSize['2xl'], 
      fontWeight: '800',
      color: '#fff',
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    email: { 
      fontSize: fontSize.md,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: spacing.base,
      fontWeight: '500',
    },
    memberSince: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    memberText: {
      fontSize: fontSize.sm,
      color: 'rgba(255,255,255,0.8)',
      marginLeft: spacing.xs,
      fontWeight: '500',
    },
    settingsBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statItem: {
      width: '48%',
      marginBottom: 12,
    },
    statCard: {
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    themeContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    themeToggle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    themeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    themeIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    themeText: {
      flex: 1,
    },
    themeTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
    },
    themeSubtitle: {
      fontSize: 14,
      fontWeight: '500',
    },
    menuContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    menuItemWrapper: {
      marginBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuItemText: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    menuSubtitle: {
      fontSize: 14,
      fontWeight: '500',
    },
    achievementContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    achievementCard: {
      padding: 20,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    achievementHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    achievementTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    viewAllText: {
      color: '#667eea',
      fontSize: 14,
      fontWeight: '600',
    },
    achievementContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    achievementIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFE06620',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    achievementEmoji: {
      fontSize: 24,
    },
    achievementText: {
      flex: 1,
    },
    achievementName: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    achievementDesc: {
      fontSize: 14,
      fontWeight: '500',
    },
    logoutContainer: {
      position: 'absolute',
      bottom: 100, // Account for bottom tab bar (~60px) + padding
      left: 20,
      right: 20,
    },
    logoutBtn: {
      borderRadius: 16,
      shadowColor: '#FF6B6B',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    logoutContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
    },
    logoutText: { 
      color: '#fff', 
      fontSize: 16, 
      fontWeight: '700',
      marginHorizontal: 8,
    },
    logoutEmoji: {
      fontSize: 16,
    },
    // Invitations Section Styles
    invitationsContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    invitationsList: {
      gap: 12,
    },
    invitationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      overflow: 'hidden',
    },
    invitationInfo: {
      flex: 1,
    },
    invitationGroupName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    invitationText: {
      fontSize: 13,
    },
    acceptButton: {
      backgroundColor: '#4ECDC4',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      marginLeft: 12,
    },
    acceptButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    acceptButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    // Notification Button Styles
    notificationBtn: {
      position: 'relative',
      padding: 8,
      marginRight: 8,
    },
    notificationBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: '#FF6B6B',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    notificationBadgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '700',
    },
  });