import {addDoc,Timestamp,collection} from "firebase/firestore";
import { db } from "@/src/services/firebase";
import {Settlement} from "@/src/types/group";

export const addSettlement = async (settlement: Settlement) => {
    
    if(!settlement.groupId || !settlement.from || !settlement.to || !settlement.amount || settlement.amount <= 0){
        console.error("❌ Missing required settlement fields", settlement);
        return;
    }

    try {
        await addDoc(collection(db, "groupSettlements"), {
            ...settlement,
            settledAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("❌ Error adding settlement", error);
    }
}