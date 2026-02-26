import { authContext } from "@/src/context/authContext";
import { listenUserGroups } from "@/src/services/group";
import { useContext, useEffect, useState } from "react";

export function useGroups() {
  const { user, loading: authLoading } = useContext(authContext);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = listenUserGroups(user.uid, (data) => {
      setGroups(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  return { groups, loading };
}
