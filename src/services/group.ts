import { Member } from "@/src/components/groups/CreateGroupModal";
import { db } from "@/src/services/firebase";
import { Group, Participant } from "@/src/types/group";
import { User } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
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

// Accept pending invitation
export const acceptGroupInvitation = async (
  groupId: string,
  userId: string,
  userEmail: string,
) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as Group;

  // Find the participant with matching email and pending status
  const updatedParticipants = groupData.participants.map((p) => {
    if (p.email === userEmail && p.status === "pending") {
      return {
        ...p,
        id: userId,
        status: "accepted" as const,
      };
    }
    return p;
  });

  // Check if any participant was actually updated
  const wasUpdated = updatedParticipants.some(
    (p, index) => p.id !== groupData.participants[index].id ||
                  p.status !== groupData.participants[index].status
  );

  if (!wasUpdated) {
    throw new Error("No pending invitation found for this user");
  }

  // Update participantIds array
  const updatedParticipantIds = Array.from(
    new Set([...(groupData.participantIds || []), userId])
  );

  await updateDoc(groupRef, {
    participants: updatedParticipants,
    participantIds: updatedParticipantIds,
  });

  return { success: true };
};

// Auto-accept pending invitations when user registers
export const autoAcceptPendingInvites = async (
  userId: string,
  userEmail: string,
) => {
  // Find all groups where this email is a pending participant
  const q = query(
    collection(db, "groups"),
    where("participants", "array-contains-any", [{ email: userEmail, status: "pending" }]),
  );

  // Alternative: Query all groups and filter client-side (more reliable)
  const allGroupsQuery = query(collection(db, "groups"));
  const snapshot = await getDocs(allGroupsQuery);

  const promises: Promise<any>[] = [];

  snapshot.docs.forEach((groupDoc) => {
    const groupData = groupDoc.data() as Group;
    const hasPendingInvite = groupData.participants.some(
      (p) => p.email === userEmail && p.status === "pending"
    );

    if (hasPendingInvite) {
      promises.push(
        acceptGroupInvitation(groupDoc.id, userId, userEmail).catch((err) => {
          console.log(`Failed to accept invite for group ${groupDoc.id}:`, err);
        })
      );
    }
  });

  await Promise.all(promises);
};

// Notification types
export type NotificationType = "invite" | "expense" | "settlement";

export interface Notification {
  id?: string;
  userId: string;
  type: NotificationType;
  message: string;
  groupId?: string;
  groupName?: string;
  read: boolean;
  createdAt: any;
}

// Create a notification
export const createNotification = async (
  notification: Omit<Notification, "id" | "createdAt" | "read">
) => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      ...notification,
      read: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Join group via invite link
export const joinGroupViaInvite = async (
  groupId: string,
  userId: string,
  userEmail: string,
  userName: string
) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data() as Group;

  // Check if user is already a participant
  const isAlreadyMember = groupData.participants.some(
    (p) => p.email === userEmail || p.id === userId
  );

  if (isAlreadyMember) {
    throw new Error("You are already a member of this group");
  }

  // Check if there's a pending invitation for this email
  const pendingInvite = groupData.participants.find(
    (p) => p.email === userEmail && p.status === "pending"
  );

  let updatedParticipants;

  if (pendingInvite) {
    // Update existing pending invitation to accepted
    updatedParticipants = groupData.participants.map((p) =>
      p.email === userEmail
        ? { ...p, id: userId, status: "accepted" as const }
        : p
    );
  } else {
    // Add as new participant
    updatedParticipants = [
      ...groupData.participants,
      {
        id: userId,
        email: userEmail,
        name: userName,
        role: "member" as const,
        status: "accepted" as const,
      },
    ];
  }

  // Update participantIds
  const updatedParticipantIds = Array.from(
    new Set([...(groupData.participantIds || []), userId])
  );

  await updateDoc(groupRef, {
    participants: updatedParticipants,
    participantIds: updatedParticipantIds,
  });

  return { success: true, groupName: groupData.name };
};

// Listen to user notifications
export const listenUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications: Notification[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Notification, "id">),
    }));
    callback(notifications);
  });
};
