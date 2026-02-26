import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export const addGroupExpense = async (
  user: User,
  groupId: string,
  title: string,
  amount: number
) => {
  // 1️⃣ Save group expense
  await addDoc(collection(db, "groupExpenses"), {
    groupId,
    userId: user.uid,
    title,
    amount,
    createdAt: Timestamp.now(),
  });

  // 2️⃣ Update group total
  await updateDoc(doc(db, "groups", groupId), {
    totalSpent: increment(amount),
  });
};