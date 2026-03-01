import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/services/firebase";
import { User } from "firebase/auth";
import { Participant } from "@/src/types/group";


export const createGroup = async (
  user: User, 
  groupName: string,
  memberEmails: string[] = []
) => {

  const participants : Participant[] = [
    {
      id: user.uid,
      email: user.email!,
      name: user.displayName ?? "You",
    },
    ...memberEmails.map((email) => ({
      email,
      name: email.split("@")[0], // temp name
    })),
  ];

  const participantIds = participants
    .filter((p) => p.id)
    .map((p) => p.id);

  return await addDoc(collection(db, "groups"), {
    name: groupName,
    totalSpent: 0, 
    createdBy: user.uid,
    participants,
    participantIds,
    createdAt: Timestamp.now(),
  });
};

// Listen user Groups in real-time

export const listenUserGroups = (userId: string, callback: (groups: any[]) => void) => {
    

    const q = query(
        collection(db, "groups"), 
        where("participantIds", "array-contains", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(groups);
    });
}
