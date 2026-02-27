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

  const safeAmount = Number(amount);
  if (!safeAmount || safeAmount <= 0) return;

  await addDoc(collection(db, "groupExpenses"), {
    groupId,
    title,
    userId: user.uid,
    amount : safeAmount,
    createdAt: Timestamp.now(),
  });

  // 2️⃣ Update group total
  await updateDoc(doc(db, "groups", groupId), {
    totalSpent: increment(safeAmount),
  });
};