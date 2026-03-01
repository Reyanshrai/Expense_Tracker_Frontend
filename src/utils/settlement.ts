type BalanceMap = Record<string, number>;

export function calculateSettlements(balances: BalanceMap) {
    const creditors :  {id:string, amount:number}[] = [];
    const debtors : {id:string, amount:number}[] = [];

    Object.entries(balances).forEach(([id, amount]) => {
        if (amount > 0) {
            creditors.push({ id, amount });
        } else if (amount < 0) {
            debtors.push({ id, amount: Math.abs(amount) });
        }
    });

    const settlements : {
        from : string;
        to : string;
        amount : number;
    }[] = [];

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
    const payAmount = Math.min(
      debtors[i].amount,
      creditors[j].amount
    );

    settlements.push({
      from: debtors[i].id,
      to: creditors[j].id,
      amount: payAmount,
    });

    debtors[i].amount -= payAmount;
    creditors[j].amount -= payAmount;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
}