import {doc,getDoc,setDoc,Timestamp} from 'firebase/firestore'
import {db} from './firebase'
import {User} from 'firebase/auth'

export const createUserProfileIfNotExists = async (user:User)=>{
    const userRef = doc(db,"user",user.uid)
    const userSnap = getDoc(userRef)

    if(!(await userSnap).exists()){
        setDoc(userRef,{
            uid: user.uid,
            email:user.email,
            name: user.displayName ?? '',
            provider:user.providerData[0]?.providerId ?? "password",
            createdAt : Timestamp.now()
        })
    }
}