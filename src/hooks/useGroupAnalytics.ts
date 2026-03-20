import { useMemo } from "react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  paidByEmail: string;
  splits: { participantEmail: string; amount: number }[];
  category?: string;
  createdAt: any;
}

interface Analytics {
  // Who spent the most
  topSpender: {
    email: string;
    amount: number;
  } | null;

  // Who owes the most (before settlements)
  topOwed: {
    email: string;
    amount: number;
  } | null;

  // Average expense
  averageExpense: number;

  // Category breakdown
  categoryBreakdown: Record<string, number>;

  // Total expenses count
  totalExpenses: number;

  // Spending by person
  spendingByPerson: Record<string, number>;
}

export function useGroupAnalytics(expenses: Expense[]): Analytics {
  return useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        topSpender: null,
        topOwed: null,
        averageExpense: 0,
        categoryBreakdown: {},
        totalExpenses: 0,
        spendingByPerson: {},
      };
    }

    // Calculate spending by person
    const spendingByPerson: Record<string, number> = {};
    expenses.forEach((expense) => {
      const payer = expense.paidByEmail;
      spendingByPerson[payer] = (spendingByPerson[payer] || 0) + expense.amount;
    });

    // Find top spender
    let topSpender: { email: string; amount: number } | null = null;
    Object.entries(spendingByPerson).forEach(([email, amount]) => {
      if (!topSpender || amount > topSpender.amount) {
        topSpender = { email, amount };
      }
    });

    // Calculate who owes the most (net balance)
    const balances: Record<string, number> = {};
    expenses.forEach((expense) => {
      // Add what they paid
      balances[expense.paidByEmail] = (balances[expense.paidByEmail] || 0) + expense.amount;
      // Subtract their share
      expense.splits?.forEach((split) => {
        balances[split.participantEmail] =
          (balances[split.participantEmail] || 0) - split.amount;
      });
    });

    // Find who owes the most (negative balance)
    let topOwed: { email: string; amount: number } | null = null;
    Object.entries(balances).forEach(([email, balance]) => {
      if (balance < 0) {
        const owedAmount = Math.abs(balance);
        if (!topOwed || owedAmount > topOwed.amount) {
          topOwed = { email, amount: owedAmount };
        }
      }
    });

    // Average expense
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averageExpense = totalAmount / expenses.length;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    expenses.forEach((expense) => {
      const category = expense.category || "Other";
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + expense.amount;
    });

    return {
      topSpender,
      topOwed,
      averageExpense,
      categoryBreakdown,
      totalExpenses: expenses.length,
      spendingByPerson,
    };
  }, [expenses]);
}

// Format currency helper
export const formatCurrency = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${Math.round(amount)}`;
};
