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

export const createGroup = async (user: User, groupName: string,memberEmails: string[] = []) => {
  return await addDoc(collection(db, "groups"), {
    name: groupName,
    totalSpent: 0, 
    createdBy: user.uid,
    members: [user.uid,],
    memberEmails,// 🔥 later resolve emails to UIDs
    createdAt: Timestamp.now(),
  });
};

// Listen user Groups in real-time

export const listenUserGroups = (userId: string, callback: (groups: any[]) => void) => {
    

    const q = query(
        collection(db, "groups"), 
        where("members", "array-contains", userId)
    );

    return onSnapshot(q, (snapshot) => {
        const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(groups);
    });
}
