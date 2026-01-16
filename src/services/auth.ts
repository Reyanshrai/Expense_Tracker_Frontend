import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const registerWithEmail = async (email:string,password:string,confirmPassword:string) =>{
    try{
        if(password !== confirmPassword){
            throw new Error("Passwords do not match")
        }
        const userCredentail = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredentail
    }catch(error:any){
        throw new Error(error.message || "SignUp Failed")
    }
}

export const loginWithEmail = async (email : string,password : string) => {
    try{
        const userCredentail = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )
        return userCredentail
    }catch(error : any){
        throw new Error(error.message || "Login Failed")
    }
}

export const logout = async () => {
    try{
        await signOut(auth)
        router.replace("/(auth)/login")
    }catch(error:any){
        throw new Error("Logout Failed")
    }
}