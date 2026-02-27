import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/src/services/firebase";

export function useGroupExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "groupExpenses"),
      where("groupId", "==", groupId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [groupId]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => {
      const amount = Number(exp.amount) || 0;
      return sum + amount;
    }, 0);
  }, [expenses]);

  return { expenses, loading, totalSpent };
}
