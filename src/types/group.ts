import { Timestamp } from "firebase/firestore";

export type Participant = {
  id?: string | null; // Firebase UID (optional)
  email: string; // primary identity
  name: string;
  role?: "admin" | "member";
  status?: "accepted" | "pending" | string;
};

export type Group = {
  id: string;
  name: string;
  participants: Participant[];
  participantIds?: string[];
  totalSpent?: number;
  budget?: number;
  createdBy: string;
  status?: string; // e.g. "active"
  createdAt?: Timestamp;
};

export type Settlement = {
  groupId: string;
  from: string; // email of debtor
  to: string; // email of creditor
  fromName?: string; // display name
  toName?: string; // display name
  amount: number;
  payMode: "cash" | "upi";
};
