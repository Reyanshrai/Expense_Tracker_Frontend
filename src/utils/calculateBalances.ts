type Split = {
  participantEmail: string;
  amount: number;
};

type Expense = {
  amount: number;
  paidByEmail: string;
  splits: Split[];
};

export const calculateBalances = (expenses: Expense[]) => {
  const balances: Record<string, number> = {};

  expenses.forEach((expense) => {
    // 1️⃣ Add paid amount
    balances[expense.paidByEmail] =
      (balances[expense.paidByEmail] || 0) + expense.amount;

    // 2️⃣ Subtract split shares
    expense.splits.forEach((split) => {
      balances[split.participantEmail] =
        (balances[split.participantEmail] || 0) - split.amount;
    });
  });

  return balances;
};
