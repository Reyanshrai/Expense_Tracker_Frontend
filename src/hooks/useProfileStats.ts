import { authContext } from "@/src/context/authContext";
import { db } from "@/src/services/firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

interface ProfileStats {
  groupsJoined: number;
  totalSpent: number;
  friendsCount: number;
  balance: number; // positive = owed to user, negative = user owes
}

export function useProfileStats() {
  const { user, loading: authLoading } = useContext(authContext);
  const [stats, setStats] = useState<ProfileStats>({
    groupsJoined: 0,
    totalSpent: 0,
    friendsCount: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid || !user?.email) {
      setStats({
        groupsJoined: 0,
        totalSpent: 0,
        friendsCount: 0,
        balance: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    const userEmail = user.email!;
    const userId = user.uid;

    // Listen to groups where user is a participant
    const groupsQuery = query(
      collection(db, "groups"),
      where("participantIds", "array-contains", userId)
    );

    // Listen to expenses paid by user
    const expensesQuery = query(
      collection(db, "groupExpenses"),
      where("paidByEmail", "==", userEmail)
    );

    // Listen to settlements where user is involved
    const settlementsFromQuery = query(
      collection(db, "groupSettlements"),
      where("from", "==", userEmail)
    );

    const settlementsToQuery = query(
      collection(db, "groupSettlements"),
      where("to", "==", userEmail)
    );

    let groupsData: any[] = [];
    let expensesData: any[] = [];
    let settlementsFromData: any[] = [];
    let settlementsToData: any[] = [];

    const calculateStats = () => {
      // Groups joined
      const groupsJoined = groupsData.length;

      // Total spent (expenses created by user)
      const totalSpent = expensesData.reduce((sum, exp) => sum + (exp.amount || 0), 0);

      // Friends count (unique participants across all groups, excluding self)
      const uniqueEmails = new Set<string>();
      groupsData.forEach((group) => {
        group.participants?.forEach((p: any) => {
          if (p.email && p.email !== userEmail) {
            uniqueEmails.add(p.email);
          }
        });
      });
      const friendsCount = uniqueEmails.size;

      // Balance calculation
      // Money user owes (user is in 'from') - negative
      const owesAmount = settlementsFromData.reduce((sum, s) => sum + (s.amount || 0), 0);
      // Money owed to user (user is in 'to') - positive
      const owedAmount = settlementsToData.reduce((sum, s) => sum + (s.amount || 0), 0);
      const balance = owedAmount - owesAmount;

      setStats({
        groupsJoined,
        totalSpent,
        friendsCount,
        balance,
      });
      setLoading(false);
    };

    const unsubscribeGroups = onSnapshot(groupsQuery, (snapshot) => {
      groupsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      calculateStats();
    });

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      expensesData = snapshot.docs.map((doc) => doc.data());
      calculateStats();
    });

    const unsubscribeSettlementsFrom = onSnapshot(settlementsFromQuery, (snapshot) => {
      settlementsFromData = snapshot.docs.map((doc) => doc.data());
      calculateStats();
    });

    const unsubscribeSettlementsTo = onSnapshot(settlementsToQuery, (snapshot) => {
      settlementsToData = snapshot.docs.map((doc) => doc.data());
      calculateStats();
    });

    return () => {
      unsubscribeGroups();
      unsubscribeExpenses();
      unsubscribeSettlementsFrom();
      unsubscribeSettlementsTo();
    };
  }, [user?.uid, user?.email, authLoading]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount}`;
  };

  // Format stats for UI
  const formattedStats = {
    groupsJoined: stats.groupsJoined.toString(),
    totalSpent: formatCurrency(stats.totalSpent),
    friendsCount: stats.friendsCount.toString(),
    balance: formatCurrency(Math.floor(stats.balance)),
    balanceLabel: stats.balance >= 0 ? "You're owed" : "You owe",
    balanceColor: stats.balance >= 0 ? "#4ECDC4" : "#FF6B6B",
  };

  return { stats, formattedStats, loading };
}
