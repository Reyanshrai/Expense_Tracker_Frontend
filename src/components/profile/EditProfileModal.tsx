import { authContext } from "@/src/context/authContext";
import { useTheme } from "@/src/context/themeContext";
import { db } from "@/src/services/firebase";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ visible, onClose }: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const { user } = useContext(authContext);
  
  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a valid name");
      return;
    }

    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: name.trim(),
      });

      // Update Firestore users collection
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          name: name.trim(),
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <BlurView
          intensity={isDark ? 80 : 90}
          tint={isDark ? "dark" : "light"}
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              padding: 24,
              backgroundColor: isDark ? "#1a1a1a" : "#fff",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.text,
                }}
              >
                Edit Profile
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.subtext} />
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.subtext,
                  marginBottom: 8,
                }}
              >
                Display Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.subtext}
                style={{
                  backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: isDark ? "#333" : "#e0e0e0",
                }}
                autoFocus
              />
            </View>

            {/* Email (Read-only) */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.subtext,
                  marginBottom: 8,
                }}
              >
                Email
              </Text>
              <View
                style={{
                  backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: isDark ? "#333" : "#e0e0e0",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.subtext,
                  }}
                >
                  {user?.email}
                </Text>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={{
                backgroundColor: "#667eea",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
