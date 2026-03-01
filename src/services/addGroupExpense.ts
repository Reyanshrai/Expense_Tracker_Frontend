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
import { Participant } from "@/src/types/group";

export const addGroupExpense = async (
  user: User,
  group: { id: string; participants: Participant[] },
  title: string,
  amount: number
) => {


  if(!Array.isArray(group.participants) || group.participants.length === 0) {
    console.error("Group has no participants or participants is not an array:", group.participants);
    return;
  }


  const splits = calculatEqualSplit(
    amount,
    group.participants
  );

  await addDoc(collection(db, "groupExpenses"), {
    groupId : group.id,
    title,
    amount,
    paidByEmail : user.email!,
    splitType : "equal",
    splits,
    createdAt: Timestamp.now(),
  });

  // 2️⃣ Update group total
  await updateDoc(doc(db, "groups", group.id), {
    totalSpent: increment(amount),
  });
};