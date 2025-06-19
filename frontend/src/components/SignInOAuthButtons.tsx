import { useSignIn } from '@clerk/clerk-react'
import React from 'react'
import { Button } from './ui/button';


const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }


    const signInWithGoogle = () => {
        signIn.authenticateWithRedirect({
            strategy:"oauth_google",
            redirectUrl:"/sso-callback",
            redirectUrlComplete:"/auth-callback",
        })
    }

    return (
        <Button variant={"secondary"} onClick={signInWithGoogle} className='w-full p-2 border-zinc-200 h-11
         bg-white group hover:transition-all text-black hover:bg-black hover:text-white'>
            <img src='/google.png' alt='img' className='size-10 group-hover:invert'/>
            Continue with Google</Button>
    )
}

export default SignInOAuthButtons
