import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, members: string[]) => void;
};

export default function CreateGroupModal({
  visible,
  onClose,
  onCreate,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  const addMember = () => {
    if (!email || members.includes(email)) return;
    setMembers([...members, email]);
    setEmail("");
  };

  const removeMember = (mail: string) => {
    setMembers(members.filter((m) => m !== mail));
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    onCreate(groupName.trim(), members);
    setGroupName("");
    setMembers([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.card,
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
              Create Group
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Group Name */}
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

          {/* Add Member */}
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <TextInput
              placeholder="Add member email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                backgroundColor: colors.input,
                color: colors.text,
              }}
            />
            <TouchableOpacity onPress={addMember} style={{ marginLeft: 10 }}>
              <Ionicons name="add-circle" size={36} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Member List */}
          <FlatList
            data={members}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text style={{ color: colors.text }}>{item}</Text>
                <TouchableOpacity onPress={() => removeMember(item)}>
                  <Ionicons name="close" size={18} color={colors.accent} />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Actions */}
          <TouchableOpacity
            onPress={handleCreate}
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 12,
              backgroundColor: colors.primary,
            }}
          >
            <Text style={{ color: colors.text, textAlign: "center" }}>
              Create Group
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}