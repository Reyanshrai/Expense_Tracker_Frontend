import { db } from "@/src/services/firebase";
import { Settlement } from "@/src/types/group";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export const addSettlement = async (settlement: Settlement) => {
    
    if(!settlement.groupId || !settlement.from || !settlement.to || !settlement.amount || settlement.amount <= 0){
        console.error("❌ Missing required settlement fields", settlement);
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "groupSettlements"), {
            ...settlement,
            settledAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("❌ Error adding settlement:", error);
    }
}