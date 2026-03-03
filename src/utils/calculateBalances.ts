type Split = {
  participantEmail: string;
  amount: number;
};

type Expense = {
  amount: number;
  paidByEmail: string;
  splits: Split[];
};

export const calculateBalances = (
  expenses: Expense[],
  settlements: any[] = [],
) => {
  const balances: Record<string, number> = {};

  // 1️⃣ Calculate net balance for each participant

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

  // 2️⃣ Adjust balances based on settlements

  settlements.forEach((s) => {
    balances[s.from] -= s.amount;
    balances[s.to] += s.amount;
  });

  return balances;
};
