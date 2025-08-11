import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { styles } from '../../src/css/group.styles';

const { width } = Dimensions.get('window');

const dummyGroups = [
  { 
    id: '1', 
    name: 'College Squad 🎓', 
    members: 4,
    totalSpent: 2450,
    recentActivity: '2h ago',
    color: '#FF6B6B',
    icon: 'school',
    avatars: ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍🎨'],
    isActive: true
  },
  { 
    id: '2', 
    name: 'Goa Vibes 🏖️', 
    members: 3,
    totalSpent: 15600,
    recentActivity: '1d ago',
    color: '#4ECDC4',
    icon: 'airplane',
    avatars: ['🏄‍♂️', '🏄‍♀️', '🌊'],
    isActive: false
  },
  { 
    id: '3', 
    name: 'Startup Hustle 💼', 
    members: 5,
    totalSpent: 8900,
    recentActivity: '5h ago',
    color: '#45B7D1',
    icon: 'bulb',
    avatars: ['💻', '☕', '🚀', '💡', '📈'],
    isActive: true
  },
  { 
    id: '4', 
    name: 'Foodie Gang 🍕', 
    members: 6,
    totalSpent: 3200,
    recentActivity: '30m ago',
    color: '#F7B731',
    icon: 'restaurant',
    avatars: ['🍕', '🍔', '🍜', '🥗', '🍰', '🍻'],
    isActive: true
  },
];

const quickActions = [
  { id: '1', title: 'Split Bill', icon: 'receipt', color: '#FF6B6B' },
  { id: '2', title: 'Add Expense', icon: 'add-circle', color: '#4ECDC4' },
  { id: '3', title: 'Settle Up', icon: 'checkmark-circle', color: '#45B7D1' },
  { id: '4', title: 'View Stats', icon: 'stats-chart', color: '#A55EEA' },
];

export default function GroupsScreen() {
  const [groups, setGroups] = useState(dummyGroups);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

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

    // Pulse animation for active indicators
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const filteredGroups = selectedFilter === 'all' 
    ? groups 
    : selectedFilter === 'active' 
    ? groups.filter(g => g.isActive)
    : groups.filter(g => !g.isActive);

  const renderGroupItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View
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
      <TouchableOpacity activeOpacity={0.8} style={styles.groupCardWrapper}>
        <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.groupCard}>
          {/* Group Header */}
          <View style={styles.groupHeader}>
            <View style={styles.groupLeft}>
              <View style={[styles.groupIcon, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
                {item.isActive && (
                  <Animated.View style={[
                    styles.activeIndicator,
                    { transform: [{ scale: pulseAnim }] }
                  ]} />
                )}
              </View>
              <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: colors.text }]}>{item.name}</Text>
                <View style={styles.groupMeta}>
                  <Text style={[styles.groupMembers, { color: colors.subtext }]}>
                    {item.members} members
                  </Text>
                  <Text style={[styles.separator, { color: colors.subtext }]}>•</Text>
                  <Text style={[styles.recentActivity, { color: colors.subtext }]}>
                    {item.recentActivity}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.groupRight}>
              <Text style={[styles.totalSpent, { color: item.color }]}>
                ₹{item.totalSpent}
              </Text>
              <Feather name="chevron-right" size={20} color={colors.subtext} />
            </View>
          </View>

          {/* Member Avatars */}
          <View style={styles.avatarContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.avatarScroll}
            >
              {item.avatars.map((avatar: any, idx: number) => (
                <View key={idx} style={[styles.avatar, { backgroundColor: `${item.color}15` }]}>
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.addMemberBtn}>
              <Ionicons name="add" size={16} color={colors.subtext} />
            </TouchableOpacity>
          </View>

          {/* Quick Actions for this group */}
          <View style={styles.groupActions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name="receipt" size={16} color={item.color} />
              <Text style={[styles.actionText, { color: item.color }]}>Split</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name="add-circle" size={16} color={item.color} />
              <Text style={[styles.actionText, { color: item.color }]}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name="checkmark-circle" size={16} color={item.color} />
              <Text style={[styles.actionText, { color: item.color }]}>Settle</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderQuickAction = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <BlurView intensity={15} tint={isDark ? "dark" : "light"} style={styles.quickActionCard}>
        <View style={[styles.quickActionIcon, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        <Text style={[styles.quickActionText, { color: colors.text }]}>{item.title}</Text>
      </BlurView>
    </TouchableOpacity>
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
        {/* Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Your Groups 👥</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
            Manage your group expenses effortlessly
          </Text>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <BlurView intensity={10} tint="light" style={styles.statsContent}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{groups.length}</Text>
                  <Text style={styles.statLabel}>Active Groups</Text>
                </View>
                <View style={styles.statsDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    ₹{groups.reduce((sum, g) => sum + g.totalSpent, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
                <View style={styles.statsDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {groups.reduce((sum, g) => sum + g.members, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Members</Text>
                </View>
              </View>
            </BlurView>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[
          styles.quickActionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions ⚡</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsList}
          />
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {['all', 'active', 'inactive'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <BlurView 
                intensity={selectedFilter === filter ? 20 : 10} 
                tint={isDark ? "dark" : "light"} 
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.activeFilterTab
                ]}
              >
                <Text style={[
                  styles.filterText,
                  { color: selectedFilter === filter ? '#667eea' : colors.subtext }
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} 
                  {filter === 'all' && ` (${groups.length})`}
                  {filter === 'active' && ` (${groups.filter(g => g.isActive).length})`}
                  {filter === 'inactive' && ` (${groups.filter(g => !g.isActive).length})`}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Groups List */}
        <Animated.View style={[
          styles.groupsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroupItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>

      {/* Create New Group Button */}
      <Animated.View style={[
        styles.createBtnContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53', '#FF6B9D']}
            style={styles.createBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <BlurView intensity={10} tint="light" style={styles.createBtnContent}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.createText}>Create New Group</Text>
              <Text style={styles.createEmoji}>🚀</Text>
            </BlurView>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

