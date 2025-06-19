import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <div className='flex items-center gap-4 justify-between'>
            <div className='flex items-center gap-3 mb-8'>
                <Link to={"/"} className='rounded-md'>
                    <img src="/logo.png" alt="iamg" className='invert size-10' />

                </Link>
                <div >
                    <h1 className='font-medium text-3xl'>Music Manager</h1>
                    <p className='text-sm text-zinc-500 mt-1'>
                        Manage Your Music Effectively
                    </p>
                </div>
                
            </div>
            <UserButton/>

        </div>
    )
}

export default Header
