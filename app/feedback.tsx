import { useTheme } from "@/src/context/themeContext";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/services/firebase";
import { borderRadius, fontSize, normalize, spacing } from "@/src/utils/responsive";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedbackScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate message
    if (!message.trim()) {
      Alert.alert("Error", "Please enter your feedback message");
      return;
    }

    setLoading(true);

    try {
      // Save feedback to Firestore
      await addDoc(collection(db, "feedback"), {
        userId: user?.uid || "anonymous",
        email: email.trim() || user?.email || "",
        message: message.trim(),
        appVersion: "1.0",
        createdAt: serverTimestamp(),
        device: Platform.OS,
      });

      // Show success message
      Alert.alert(
        "Thank you!",
        "Your feedback helps us improve the app.",
        [{ text: "OK", onPress: () => router.back() }]
      );

      // Clear input
      setMessage("");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.05)", "transparent"]
            : ["rgba(102, 126, 234, 0.05)", "rgba(118, 75, 162, 0.03)", "transparent"]
        }
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingTop: insets.top + spacing.md,
          paddingBottom: spacing.md,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: normalize(40),
            height: normalize(40),
            borderRadius: borderRadius.full,
            backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            justifyContent: "center",
            alignItems: "center",
            marginRight: spacing.md,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: fontSize.xl,
            fontWeight: "700",
            color: colors.text,
          }}
        >
          Send Feedback
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: 140 + insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Description Card */}
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.xl,
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
              borderWidth: 1,
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              marginBottom: spacing.xl,
            }}
          >
            <View
              style={{
                width: normalize(50),
                height: normalize(50),
                borderRadius: borderRadius.full,
                backgroundColor: "#667eea20",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: spacing.md,
              }}
            >
              <Ionicons name="chatbubble-ellipses" size={24} color="#667eea" />
            </View>
            <Text
              style={{
                fontSize: fontSize.lg,
                fontWeight: "600",
                color: colors.text,
                marginBottom: spacing.xs,
              }}
            >
              We value your feedback
            </Text>
            <Text
              style={{
                fontSize: fontSize.md,
                color: colors.subtext,
                lineHeight: normalize(22),
              }}
            >
              Tell us what you like or what we can improve. Your feedback helps us make the app better for everyone.
            </Text>
          </BlurView>

          {/* Feedback Form */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: "600",
                color: colors.text,
                marginBottom: spacing.sm,
              }}
            >
              Feedback Message *
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Share your thoughts..."
              placeholderTextColor={colors.subtext}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{
                backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                fontSize: fontSize.md,
                color: colors.text,
                minHeight: normalize(150),
                borderWidth: 1,
                borderColor: isDark ? "#333" : "#e0e0e0",
              }}
            />
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: "600",
                color: colors.text,
                marginBottom: spacing.sm,
              }}
            >
              Email (Optional)
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                fontSize: fontSize.md,
                color: colors.text,
                borderWidth: 1,
                borderColor: isDark ? "#333" : "#e0e0e0",
              }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={{
                borderRadius: borderRadius.lg,
                paddingVertical: spacing.md,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <BlurView intensity={10} tint="light" style={{ borderRadius: borderRadius.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: spacing.xl,
                  }}
                >
                  {loading ? (
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: fontSize.lg,
                        fontWeight: "700",
                      }}
                    >
                      Submitting...
                    </Text>
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#fff" style={{ marginRight: spacing.sm }} />
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: fontSize.lg,
                          fontWeight: "700",
                        }}
                      >
                        Submit Feedback
                      </Text>
                    </>
                  )}
                </View>
              </BlurView>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
