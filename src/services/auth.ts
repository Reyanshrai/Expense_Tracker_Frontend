import {signInWithEmailAndPassword,signOut } from 'firebase/auth';
import {auth} from './firebase'

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
    }catch(error:any){
        throw new Error("Logout Failed")
    }
}