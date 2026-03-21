import { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, increment, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';

export const addExpense = async (
    user:User,
    {
        title,
        amount,
        category,
    }:{
        title : string,
        amount : number,
        category : string
    }
) =>{
    return await addDoc(collection(db,"expenses"),{
        userId : user.uid,
        title,
        amount,
        category,
        createdAt : Timestamp.now()
    })
}


export const listenUserExpenses = (userId:string,callback:(data:any[]) => void) =>{
    const q = query(
        collection(db,"expenses"),
        where("userId" ,"==",userId),
        orderBy("createdAt", "desc")
    )

    return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(expenses);
  });
}

// Group Expense Edit/Delete Functions
export interface GroupExpense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidByEmail: string;
  splitType: string;
  splits: any[];
  createdAt: any;
}

// Get single expense
export const getGroupExpense = async (expenseId: string): Promise<GroupExpense | null> => {
  const expenseRef = doc(db, "groupExpenses", expenseId);
  const expenseSnap = await getDoc(expenseRef);
  if (expenseSnap.exists()) {
    return { id: expenseSnap.id, ...expenseSnap.data() } as GroupExpense;
  }
  return null;
};

// Update expense
export const updateGroupExpense = async (
  expenseId: string,
  updates: { title?: string; amount?: number },
  oldAmount: number
) => {
  const expenseRef = doc(db, "groupExpenses", expenseId);
  const expenseSnap = await getDoc(expenseRef);
  
  if (!expenseSnap.exists()) {
    throw new Error("Expense not found");
  }
  
  const expenseData = expenseSnap.data() as GroupExpense;
  const groupId = expenseData.groupId;
  
  // Update the expense
  await updateDoc(expenseRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
  
  // Update group total if amount changed
  if (updates.amount !== undefined && updates.amount !== oldAmount) {
    const amountDiff = updates.amount - oldAmount;
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
      totalSpent: increment(amountDiff),
    });
  }
};

// Delete expense
export const deleteGroupExpense = async (expenseId: string) => {
  const expenseRef = doc(db, "groupExpenses", expenseId);
  const expenseSnap = await getDoc(expenseRef);
  
  if (!expenseSnap.exists()) {
    throw new Error("Expense not found");
  }
  
  const expenseData = expenseSnap.data() as GroupExpense;
  const groupId = expenseData.groupId;
  const amount = expenseData.amount;
  
  // Delete the expense
  await deleteDoc(expenseRef);
  
  // Update group total
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, {
    totalSpent: increment(-amount),
  });
};
