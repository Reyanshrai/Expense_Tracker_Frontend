import { useTheme } from "@/src/context/themeContext";
import { showError, validateEmail, validateGroupName } from "@/src/utils/errorHandler";
import { darkColors, lightColors } from "@/src/utils/themeColors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export type Member = {
  name: string;
  email: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, members: Member[]) => void;
  mode?: "create" | "addMember";
  groupName?: string;
};

export default function CreateGroupModal({
  visible,
  onClose,
  onCreate,
  mode = "create",
  groupName: existingGroupName,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const [groupName, setGroupName] = useState(existingGroupName || "");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);

  const addMember = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    
    if (!trimmedName || !trimmedEmail) {
      showError("unknown", "Please enter both name and email");
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      showError("invalid_email");
      return;
    }
    
    if (members.some((m) => m.email === trimmedEmail)) {
      showError("duplicate_email");
      return;
    }
    
    setMembers([...members, { name: trimmedName, email: trimmedEmail }]);
    setName("");
    setEmail("");
  };

  const removeMember = (emailToRemove: string) => {
    setMembers(members.filter((m) => m.email !== emailToRemove));
  };

  const handleCreate = () => {
    if (mode === "create" && !validateGroupName(groupName)) {
      showError("empty_group_name");
      return;
    }
    onCreate(mode === "create" ? groupName.trim() : existingGroupName || "", members);
    setGroupName("");
    setName("");
    setEmail("");
    setMembers([]);
    onClose();
  };

  const handleClose = () => {
    setGroupName("");
    setName("");
    setEmail("");
    setMembers([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                backgroundColor: colors.card,
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, color: colors.text }}>
                  {mode === "create" ? "Create Group" : "Add Member"}
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Group Name - Only visible in create mode */}
                {mode === "create" && (
                  <TextInput
                    placeholder="Group name"
                    placeholderTextColor={colors.subtext}
                    value={groupName}
                    onChangeText={setGroupName}
                    style={{
                      marginTop: 16,
                      padding: 12,
                      borderRadius: 10,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                  />
                )}

                {/* Member Name */}
                <TextInput
                  placeholder="Member name"
                  placeholderTextColor={colors.subtext}
                  value={name}
                  onChangeText={setName}
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: colors.input,
                    color: colors.text,
                  }}
                />

                {/* Member Email with Add Button */}
                <View style={{ flexDirection: "row", marginTop: 12 }}>
                  <TextInput
                    placeholder="Member email"
                    placeholderTextColor={colors.subtext}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 10,
                      backgroundColor: colors.input,
                      color: colors.text,
                    }}
                  />
                  <TouchableOpacity
                    onPress={addMember}
                    style={{
                      marginLeft: 10,
                      padding: 12,
                      borderRadius: 10,
                      backgroundColor: colors.primary,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="add" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Member List */}
                {members.length > 0 && (
                  <View style={{ marginTop: 16 }}>
                    <Text style={{ color: colors.subtext, marginBottom: 8 }}>
                      Members ({members.length})
                    </Text>
                    {members.map((member) => (
                      <View
                        key={member.email}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 12,
                          marginTop: 8,
                          borderRadius: 10,
                          backgroundColor: colors.input,
                        }}
                      >
                        <View>
                          <Text style={{ color: colors.text, fontWeight: "500" }}>
                            {member.name}
                          </Text>
                          <Text style={{ color: colors.subtext, fontSize: 12 }}>
                            {member.email}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeMember(member.email)}
                        >
                          <Ionicons name="close" size={18} color={colors.accent} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Actions */}
                <TouchableOpacity
                  onPress={handleCreate}
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: colors.primary,
                  }}
                >
                  <Text style={{ color: colors.text, textAlign: "center" }}>
                    {mode === "create" ? "Create Group" : "Add Member"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
