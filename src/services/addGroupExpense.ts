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
import { calculatEqualSplit } from "@/src/utils/split";

export const addGroupExpense = async (
  user: User,
  group: any,
  title: string,
  amount: number
) => {
  // 1️⃣ Save group expense

  const safeAmount = Number(amount);
  if (!safeAmount || safeAmount <= 0) return;

  console.log("ADD EXPENSE → GROUP MEMBERS:", group.members);
console.log("IS ARRAY:", Array.isArray(group.members));

  const splits = calculatEqualSplit(
    safeAmount,
    group.participants
  );

  await addDoc(collection(db, "groupExpenses"), {
    groupId : group.id,
    title,
    amount : safeAmount,
    paidBy : user.uid,
    splitType : "equal",
    splits,
    createdAt: Timestamp.now(),
  });

  // 2️⃣ Update group total
  await updateDoc(doc(db, "groups", group.id), {
    totalSpent: increment(safeAmount),
  });
};