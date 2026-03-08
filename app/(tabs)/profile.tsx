import Skeleton from "@/src/components/ui/Skeleton";
import { useTheme } from "@/src/context/themeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotifications } from "@/src/hooks/useNotifications";
import { usePendingInvites } from "@/src/hooks/usePendingInvites";
import { useProfileStats } from "@/src/hooks/useProfileStats";
import { logout } from '@/src/services/auth';
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../src/css/profile.styles';

const { width } = Dimensions.get('window');

const menuItems = [
  { 
    id: '1', 
    title: 'Edit Profile', 
    subtitle: 'Update your personal information',
    icon: 'person-circle', 
    color: '#FF6B6B',
    action: () => Alert.alert('Coming Soon', 'Profile editing feature is coming soon! 🚧')
  },
  { 
    id: '2', 
    title: 'Manage Groups', 
    subtitle: 'View and manage your groups',
    icon: 'people-circle', 
    color: '#4ECDC4',
    action: () => Alert.alert('Coming Soon', 'Group management is under development! 👥')
  },
  { 
    id: '3', 
    title: 'Payment Methods', 
    subtitle: 'Add or update payment options',
    icon: 'card', 
    color: '#45B7D1',
    action: () => Alert.alert('Coming Soon', 'Payment methods coming soon! 💳')
  },
  { 
    id: '4', 
    title: 'Notifications', 
    subtitle: 'Manage notification preferences',
    icon: 'notifications-circle', 
    color: '#F7B731',
    action: () => Alert.alert('Coming Soon', 'Notification settings coming soon! 🔔')
  },
  { 
    id: '5', 
    title: 'Security & Privacy', 
    subtitle: 'Change password and privacy settings',
    icon: 'shield-checkmark', 
    color: '#A55EEA',
    action: () => Alert.alert('Coming Soon', 'Security settings coming soon! 🛡️')
  },
  { 
    id: '6', 
    title: 'Help & Support', 
    subtitle: 'Get help or contact support',
    icon: 'help-circle', 
    color: '#FF8E53',
    action: () => Alert.alert('Help & Support', 'Need help? Contact us at help@expenseapp.com 📧')
  },
];

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { user } = useAuth();
  const { formattedStats, loading: statsLoading } = useProfileStats();
  const { pendingInvites, loading: invitesLoading, acceptInvite, accepting, hasPendingInvites } = usePendingInvites();
  const { unreadCount, hasUnread } = useNotifications();
  const router = useRouter()

  // Dynamic stats from Firestore
  const profileStats = [
    { id: '1', label: 'Groups Joined', value: formattedStats.groupsJoined, icon: 'people', color: '#FF6B6B' },
    { id: '2', label: 'Total Spent', value: formattedStats.totalSpent, icon: 'card', color: '#4ECDC4' },
    { id: '3', label: 'Friends', value: formattedStats.friendsCount, icon: 'heart', color: '#45B7D1' },
    { id: '4', label: formattedStats.balanceLabel, value: formattedStats.balance, icon: 'trending-up', color: formattedStats.balanceColor },
  ];

  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Pulse animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogout = async () => {
    await logout()
    router.replace("/(auth)/login")
  };

  const renderStatItem = ({ item }: { item: any }) => (
    <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      {statsLoading ? (
        <Skeleton width={50} height={20} style={{ marginVertical: 4 }} />
      ) : (
        <Text style={[styles.statValue, { color: colors.text }]}>{item.value}</Text>
      )}
      <Text style={[styles.statLabel, { color: colors.subtext }]}>{item.label}</Text>
    </BlurView>
  );

  const renderMenuItem = (item: any, index: number) => (
    <Animated.View
      key={item.id}
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={item.action}
        style={styles.menuItemWrapper}
      >
        <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.menuSubtitle, { color: colors.subtext }]}>{item.subtitle}</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={colors.subtext} />
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={isDark 
          ? ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.05)', 'transparent']
          : ['rgba(102, 126, 234, 0.05)', 'rgba(118, 75, 162, 0.03)', 'transparent']
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Profile Section */}
        <Animated.View style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <BlurView intensity={10} tint="light" style={styles.profileContent}>
              <View style={styles.profileHeader}>
                <Animated.View style={[
                  styles.avatarContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                    style={styles.avatar}
                  />
                  <View style={styles.onlineIndicator} />
                  <TouchableOpacity style={styles.editAvatarBtn}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
                <View style={styles.profileInfo}>
                  <Text style={styles.name}>{user?.displayName || "No Name"}</Text>
                  <Text style={styles.email}>{user?.email}</Text>
                  <View style={styles.memberSince}>
                    <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.memberText}>{user?.metadata.creationTime? new Date(user.metadata.creationTime).toLocaleDateString('en-IN'):""}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.notificationBtn}
                  onPress={() => router.push('/notifications')}
                >
                  <Ionicons name="notifications" size={20} color="rgba(255,255,255,0.8)" />
                  {hasUnread && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsBtn}>
                  <Ionicons name="settings" size={20} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Stats 📊</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((item, index) => (
              <View key={item.id} style={styles.statItem}>
                {renderStatItem({ item })}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Invitations Section */}
        {hasPendingInvites && (
          <Animated.View style={[
            styles.invitationsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Invitations 📩</Text>
            <View style={styles.invitationsList}>
              {pendingInvites.map((invite) => (
                <BlurView 
                  key={invite.groupId} 
                  intensity={20} 
                  tint={isDark ? "dark" : "light"} 
                  style={styles.invitationCard}
                >
                  <View style={styles.invitationInfo}>
                    <Text style={[styles.invitationGroupName, { color: colors.text }]}>
                      {invite.groupName}
                    </Text>
                    <Text style={[styles.invitationText, { color: colors.subtext }]}>
                      Invited by {invite.invitedBy}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => acceptInvite(invite.groupId)}
                    disabled={accepting === invite.groupId}
                    style={[
                      styles.acceptButton,
                      accepting === invite.groupId && styles.acceptButtonDisabled
                    ]}
                  >
                    <Text style={styles.acceptButtonText}>
                      {accepting === invite.groupId ? 'Accepting...' : 'Accept'}
                    </Text>
                  </TouchableOpacity>
                </BlurView>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Theme Toggle */}
        <Animated.View style={[
          styles.themeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.themeToggle}>
            <View style={styles.themeLeft}>
              <View style={[styles.themeIcon, { backgroundColor: isDark ? '#FFE06620' : '#667eea20' }]}>
                <Ionicons 
                  name={isDark ? "moon" : "sunny"} 
                  size={24} 
                  color={isDark ? '#FFE066' : '#667eea'} 
                />
              </View>
              <View style={styles.themeText}>
                <Text style={[styles.themeTitle, { color: colors.text }]}>
                  {isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                </Text>
                <Text style={[styles.themeSubtitle, { color: colors.subtext }]}>
                  {isDark ? 'Easy on the eyes' : 'Bright and clean'}
                </Text>
              </View>
            </View>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: '#667eea' }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#E0E0E0"
            />
          </BlurView>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View style={[
          styles.menuContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account & Settings ⚙️</Text>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </Animated.View>

      </ScrollView>

      {/* Logout Button */}
      <Animated.View style={[
        styles.logoutContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
          <LinearGradient
            colors={['#FF6B6B', '#FF4757']}
            style={styles.logoutBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <BlurView intensity={10} tint="light" style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
              <Text style={styles.logoutEmoji}>👋</Text>
            </BlurView>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

