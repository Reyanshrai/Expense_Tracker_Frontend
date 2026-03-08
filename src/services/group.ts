import { Member } from "@/src/components/groups/CreateGroupModal";
import { db } from "@/src/services/firebase";
import { Group, Participant } from "@/src/types/group";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export const createGroup = async (
  user: User,
  groupName: string,
  members: Member[] = [],
) => {
  const participants: Participant[] = [
    {
      id: user.uid,
      email: user.email!,
      name: user.displayName ?? "You",
      role: "admin",
      status: "accepted",
    },
    ...members.map((member) => ({
      id: null, // will be updated when they accept
      email: member.email,
      name: member.name,
      role: "member" as const,
      status: "pending" as const,
    })),
  ];


  const participantIds = participants
    .filter((p) => p.id)
    .map((p) => p.id as string);

  return await addDoc(collection(db, "groups"), {
    name: groupName,
    totalSpent: 0,
    createdBy: user.uid,
    participants,
    participantIds,
    status: "active",
    createdAt: Timestamp.now(),
  });
};

// Add members to existing group
export const addMembersToGroup = async (
  groupId: string,
  members: Member[],
) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as Group;
  const existingEmails = new Set(groupData.participants.map((p) => p.email));

  const newParticipants: Participant[] = members
    .filter((member) => !existingEmails.has(member.email))
    .map((member) => ({
      id: null,
      email: member.email,
      name: member.name,
      role: "member" as const,
      status: "pending" as const,
    }));

  if (newParticipants.length === 0) {
    return; // No new members to add
  }

  const updatedParticipants = [...groupData.participants, ...newParticipants];

  await updateDoc(groupRef, {
    participants: updatedParticipants,
  });
};

// Update group status
export const updateGroupStatus = async (
  groupId: string,
  status: "active" | "completed" | "settled",
) => {
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, { status });
};

// Update group budget
export const updateGroupBudget = async (
  groupId: string,
  budget: number,
) => {
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, { budget });
};

// Check if user is admin of group
export const isGroupAdmin = (
  group: Group,
  userId: string,
): boolean => {
  return group.participants.some(
    (p) => p.id === userId && p.role === "admin",
  );
};

// Listen user Groups in real-time
export const listenUserGroups = (
  userId: string,
  callback: (groups: Group[]) => void,
) => {
  const q = query(
    collection(db, "groups"),
    where("participantIds", "array-contains", userId),
  );

  return onSnapshot(q, (snapshot) => {
    const groups: Group[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...(doc.data() as any),
        }) as Group,
    );

    callback(groups);
  });
};
