
export type Participant = {
  id?: string;      // Firebase UID (optional)
  email: string;    // primary identity
  name: string;     // display name
};

export type Group = {
  id: string;
  name: string;
  participants: Participant[];
  totalSpent?: number;
  createdBy: string;
};