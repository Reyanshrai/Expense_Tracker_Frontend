export function calculatEqualSplit(amount: number, participants: any[]) {
  console.log(
    "PARTICIPANTS ARRAY 👉",
    participants,
    Array.isArray(participants),
  );

  console.log("PARTICIPANTS RAW 👉", participants);
  console.log("TYPE 👉", typeof participants);
  console.log("IS ARRAY 👉", Array.isArray(participants));

  if (!Array.isArray(participants) || participants.length === 0) {
    console.error("❌ Invalid participants array", participants);
    return [];
  }

  const perPerson = amount / participants.length;

  return participants.map((participant) => ({
    name: participant.name,
    email: participant.email,
    userId: participant.id ?? null,
    amount: perPerson,
  }));
}
