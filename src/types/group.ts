export type Participant = {
  id?: string | null; // Firebase UID (optional)
  email: string; // primary identity
  name: string;
  role?: "admin" | "member";
  status?: "accepted" | "pending";
};

export type Group = {
  id: string;
  name: string;
  participants: Participant[];
  totalSpent?: number;
  createdBy: string;
};

export type Settlement = {
  groupId: string;
  from: string; // email of debtor
  to: string; // email of creditor
  amount: number;
  payMode: "cash" | "upi";
};
