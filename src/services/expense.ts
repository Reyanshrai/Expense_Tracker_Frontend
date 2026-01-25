import {addDoc,getDocs,query,where,orderBy,collection,Timestamp,onSnapshot} from 'firebase/firestore';
import {db} from './firebase';
import {User} from 'firebase/auth';

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
