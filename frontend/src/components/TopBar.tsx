import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/clerk-react';
import { Download, LayoutDashboardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignInOAuthButtons from './SignInOAuthButtons';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '../lib/utils';
import { buttonVariants } from './ui/button';
import { clsx } from 'clsx';

const TopBar = () => {
    const { isAdmin } = useAuthStore();
    console.log(isAdmin);
    return (
        <div className='flex items-center justify-between sticky top-0 shadow-md p-4 bg-zinc-800/75 backdrop-blur-md z-10 rounded-md'>
            <div className='flex gap-2 items-center font-bold  text-lg'>
                <img src="/logo.png" alt="logo" className='size-10 invert' />
                Music Player
            </div>


            <div className='flex items-center gap-10'>

                {isAdmin && (
                    <Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))} >

                        <LayoutDashboardIcon className='h-4 w-4' />Admin Dashboard

                    </Link>
                )}
                {/* <div className='flex items-center gap-2'>
                    <Link to={"/"} className={clsx(buttonVariants({ variant: "outline" }))} >
                        <Download className='h-4 w-4' />Download
                    </Link>

                </div> */}


                <SignedOut>
                    <SignInOAuthButtons />
                </SignedOut>

                <UserButton />
            </div>
        </div>
    )
}

export default TopBar
