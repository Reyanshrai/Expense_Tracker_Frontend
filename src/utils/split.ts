import { Participant } from "@/src/types/group";

export function calculatEqualSplit(
  totalAmount: number,
  participants: Participant[],
) {
  if (!Array.isArray(participants) || participants.length === 0) {
    console.error("❌ Invalid participants array", participants);
    return [];
  }

  const perPerson = Number(totalAmount / participants.length).toFixed(2);

  return participants.map((p) => {
    if (!p.email) {
      console.error("❌ Participant missing email", p);
    }

    return {
      participantEmail: p.email, // ✅ REQUIRED
      participantName: p.name, // optional (UI)
      amount: perPerson,
    };
  });
}
