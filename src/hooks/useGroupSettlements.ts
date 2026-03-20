import { db } from "@/src/services/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export type Settlement = {
  id: string;
  groupId: string;
  from: string; // email
  to: string; // email
  fromName?: string; // display name
  toName?: string; // display name
  amount: number;
  payMode: "cash" | "upi";
  settledAt: any;
};

export function useGroupSettlements(groupId: string | undefined) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setSettlements([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Note: This query requires a Firestore composite index:
    // Collection: groupSettlements, Fields: groupId (Ascending), settledAt (Descending)
    const q = query(
      collection(db, "groupSettlements"),
      where("groupId", "==", groupId),
      orderBy("settledAt", "desc"),
    );

    // Test query without orderBy to check if data exists
    const qTest = query(
      collection(db, "groupSettlements"),
      where("groupId", "==", groupId),
    );
    onSnapshot(qTest, (testSnap) => {
      testSnap.docs.forEach((doc) => {
        doc.id, 
        doc.data()
      });
    });

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Settlement[] = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...(docData as Omit<Settlement, "id">),
          };
        });
        setSettlements(data);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error fetching settlements:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
        console.error("Error code:", error.code);
        console.error("Error name:", error.name);
        if (error.message?.includes("index") || error.code === "failed-precondition") {
          console.error("🔥 FIRESTORE INDEX REQUIRED!");
          console.error("Create index at: https://console.firebase.google.com/project/_/firestore/indexes");
          console.error("Collection: groupSettlements, Fields: groupId (Ascending), settledAt (Descending)");
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [groupId]);

  return { settlements, loading };
}
