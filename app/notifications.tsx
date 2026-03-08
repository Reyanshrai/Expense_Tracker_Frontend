import EmptyState from "@/src/components/ui/EmptyState";
import { useTheme } from "@/src/context/themeContext";
import { useNotifications } from "@/src/hooks/useNotifications";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotificationsScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const router = useRouter();
  const { notifications, loading, markAsRead, markAllAsRead, hasUnread } =
    useNotifications();

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "";
    const date =
      timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "invite":
        return { name: "people", color: "#4ECDC4" };
      case "expense":
        return { name: "card", color: "#FF6B6B" };
      case "settlement":
        return { name: "checkmark-circle", color: "#45B7D1" };
      default:
        return { name: "notifications", color: "#A55EEA" };
    }
  };

  const handleNotificationPress = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navigate to group if groupId exists
    if (notification.groupId) {
      // router.push(`/group/${notification.groupId}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        {hasUnread && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.list}>
        {loading ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            Loading...
          </Text>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            title="No notifications"
            subtitle="We'll notify you when something important happens"
          />
        ) : (
          notifications.map((notification) => {
            const icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
              >
                <BlurView
                  intensity={20}
                  tint={isDark ? "dark" : "light"}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.unreadCard,
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${icon.color}20` },
                    ]}
                  >
                    <Ionicons name={icon.name as any} size={24} color={icon.color} />
                  </View>
                  <View style={styles.content}>
                    <Text
                      style={[
                        styles.message,
                        { color: colors.text },
                        !notification.read && styles.unreadText,
                      ]}
                    >
                      {notification.message}
                    </Text>
                    {notification.groupName && (
                      <Text style={[styles.groupName, { color: colors.subtext }]}>
                        {notification.groupName}
                      </Text>
                    )}
                    <Text style={[styles.time, { color: colors.subtext }]}>
                      {formatDate(notification.createdAt)}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </BlurView>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#4ECDC4",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadText: {
    fontWeight: "600",
  },
  groupName: {
    fontSize: 12,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ECDC4",
    marginLeft: 8,
  },
});
