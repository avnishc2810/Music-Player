import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/stores/useChatStore'
import { useUser } from '@clerk/clerk-react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Divide, HeadphonesIcon, Music, Users, Users2 } from 'lucide-react'
import { useEffect } from 'react'

const FriendsActivity = () => {

    const { isLoading, fetchAllUsers, users, onlineUsers, userActivities } = useChatStore()
    const { user } = useUser()
    useEffect(() => {
        if (user) {
            fetchAllUsers();
        }

    }, [fetchAllUsers, user])

    console.log(users);
    return (



        <div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
            <div className='p-4 flex justify-between items-center border-b bg-zinc-800'>
                <div className='flex items-center gap-2'>
                    <Users2 className='size-5 shrink-0' />
                    <div className='font-bold'>What are they listening to?</div>
                </div>
            </div>

            {!user && <LoginPrompt />}
            <ScrollArea className='flex-1'>
                <div className='p-4 space-y-4'>
                    {users?.map((user) => {

                        const activity = userActivities.get(user.clerkId)
                        const isPlaying = activity && activity !== "Idle"
                        return (
                            <div key={user._id} className='cursor-pointer hover:bg-zinc-600 
                                transition-colors rounded-md group bg-zinc-800 p-4'>
                                <div className='flex items-start gap-3'>
                                    <div className="relative">
                                        <Avatar className='size-10'>
                                            <AvatarImage src={user.imageUrl} alt='userimage' />
                                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-800 ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-700"}`} aria-hidden="true" />
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-medium text-sm text-white'>{user.fullName}</span>
                                            {isPlaying && <Music className='size-4 text-blue-300' />}
                                        </div>

                                        {isPlaying ? (
                                            <div className='mt-1'>
                                                <div className='mt-1 text-sm text-white font-medium truncate'>
                                                    {activity.replace("Playing","").split(" by ")[0]}
                                                </div>
                                                <div className='text-xs text-white truncate font-medium'>
                                                    {activity.split(" by ")[1]}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='text-xs'>Idle</div>
                                        )}
                                    </div>


                                </div>


                            </div>
                        )
                    }
                    )}
                </div>

            </ScrollArea>
        </div>
    )
}



const LoginPrompt = () => (
    <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
        <div className='relative'>
            <div
                className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
                aria-hidden='true'
            />
            <div className='relative bg-zinc-900 rounded-full p-4'>
                <HeadphonesIcon className='size-8 text-emerald-400' />
            </div>
        </div>

        <div className='space-y-2 max-w-[250px]'>
            <h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
            <p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
        </div>
    </div>
);


export default FriendsActivity
