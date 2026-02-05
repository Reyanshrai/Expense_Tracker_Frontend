import { categoryMeta } from "./categoryMeta";

export function calcCategoryStats(expenses: any[]) {
  if (!expenses || expenses.length === 0) return [];

  // 1️⃣ total spent
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 2️⃣ group by category
  const map: Record<string, number> = {};

  expenses.forEach((e) => {
    if (!map[e.category]) {
      map[e.category] = 0;
    }
    map[e.category] += e.amount;
  });

  // 3️⃣ convert to UI format
  const result = Object.keys(map).map((cat) => {
    const meta = categoryMeta[cat]; // icon + color
    const amount = map[cat];
    const percentage = Math.round((amount / total) * 100);

    return {
      category: cat,
      amount,
      percentage,
      icon: meta?.icon || "ellipse",
      color: meta?.color || "#999",
    };
  });

  // 4️⃣ sort highest first
  return result.sort((a, b) => b.amount - a.amount);
}
