import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/src/services/firebase";

export function useGroupSettlements(groupId: string) {
  const [settlements, setSettlements] = useState<any[]>([]);

  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "groupSettlements"),
      where("groupId", "==", groupId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setSettlements(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return unsub;
  }, [groupId]);

  return settlements;
}