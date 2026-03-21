import { authContext } from "@/src/context/authContext";
import { db } from "@/src/services/firebase";
import { acceptGroupInvitation } from "@/src/services/group";
import { Group } from "@/src/types/group";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

interface PendingInvite {
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedAt: any;
}

export function usePendingInvites() {
  const { user, loading: authLoading } = useContext(authContext);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid || !user?.email) {
      setPendingInvites([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const userEmail = user.email!;

    // Query all groups and filter for pending invites client-side
    const q = query(collection(db, "groups"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const invites: PendingInvite[] = [];

        snapshot.docs.forEach((doc) => {
          const groupData = doc.data() as Group;

          // Check if user has a pending invitation in this group
          const pendingParticipant = groupData.participants?.find(
            (p) => p.email === userEmail && p.status === "pending"
          );

          if (pendingParticipant) {
            // Find who invited them (the admin)
            const inviter = groupData.participants?.find(
              (p) => p.role === "admin" && p.status === "accepted"
            );

            invites.push({
              groupId: doc.id,
              groupName: groupData.name,
              invitedBy: inviter?.name || "Unknown",
              invitedAt: groupData.createdAt,
            });
          }
        });

        setPendingInvites(invites);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching pending invites:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, user?.email, authLoading]);

  const acceptInvite = async (groupId: string): Promise<boolean> => {
    if (!user?.uid || !user?.email) return false;

    setAccepting(groupId);
    try {
      await acceptGroupInvitation(groupId, user.uid, user.email);
      return true;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      return false;
    } finally {
      setAccepting(null);
    }
  };

  return {
    pendingInvites,
    loading,
    acceptInvite,
    accepting,
    hasPendingInvites: pendingInvites.length > 0,
  };
}
