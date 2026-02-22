import { authContext } from "@/src/context/authContext";
import { listenUserExpenses } from "@/src/services/expense";
import { Timestamp } from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdAt: Timestamp;
};

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  Food: { icon: "🍕", color: "#FF6B8A" },
  Travel: { icon: "✈️", color: "#4ECDC4" },
  Entertainment: { icon: "🎬", color: "#FFE66D" },
};

export function useSummary() {
  const { user, loading: authLoading } = useContext(authContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = listenUserExpenses(user.uid, (data) => {
      setExpenses(data as Expense[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  const summary = useMemo(() => {
    let total = 0;
    const map = new Map<string, any>();

    expenses.forEach((exp) => {
      total += exp.amount;

      if (!map.has(exp.category)) {
        map.set(exp.category, {
          name: exp.category,
          amount: 0,
          icon: CATEGORY_META[exp.category]?.icon ?? "💸",
          color: CATEGORY_META[exp.category]?.color ?? "#999",
        });
      }

      map.get(exp.category).amount += exp.amount;
    });

    const categories = Array.from(map.values()).map((item) => ({
      ...item,
      percentage:
        total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0,
    }));

    return { total, categories };
  }, [expenses]);

  return {
    total: summary.total,
    categories: summary.categories,
    loading,
  };
}