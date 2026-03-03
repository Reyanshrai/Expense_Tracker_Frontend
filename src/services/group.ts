import { db } from "@/src/services/firebase";
import { Participant } from "@/src/types/group";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

export const createGroup = async (
  user: User,
  groupName: string,
  memberEmails: string[] = [],
) => {
  const participants: Participant[] = [
    {
      id: user.uid,
      email: user.email!,
      name: user.displayName ?? "You",
      role: "admin",
      status: "accepted",
    },
    ...memberEmails.map((email) => ({
      id: null, // will be updated when they accept
      email,
      name: email.split("@")[0],
      role: "member" as const,
      status: "pending" as const,
    })),
  ];

  const participantIds = participants.filter((p) => p.id).map((p) => p.id);

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

// Listen user Groups in real-time

export const listenUserGroups = (
  userId: string,
  callback: (groups: any[]) => void,
) => {
  const q = query(
    collection(db, "groups"),
    where("participantIds", "array-contains", userId),
  );

  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(groups);
  });
};
